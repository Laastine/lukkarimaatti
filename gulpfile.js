var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    concatCss = require('gulp-concat-css'),
    browserify = require('browserify'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    transform = require('vinyl-transform')

var paths = {
    js: './src/main/webapp/js/main.js',
    tests: './src/test/webapp/*.js',
    styles: './src/main/webapp/*.css',
    dist: './src/main/webapp/dist/'
}

function handleError(err) {
    console.log(err.message)
    this.emit('end')
}

gulp.task('compile', function () {
    browserify({
        entries: [paths.js],
        debug: true
    }).bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest(paths.dist))
        .pipe(livereload())
})

gulp.task('styles', function () {
    gulp.src('styles/main.css')
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest(paths.dist))
})

gulp.task('lint', function () {
    gulp.src(paths.js)
        .pipe(jshint({
            globals: {
                require: false
            },
            asi: true
        }))
        .pipe(jshint.reporter('default'))
})

gulp.task('compress', function () {
    browserify(paths.js)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .on('error', handleError)
        .pipe(gulp.dest(paths.dist))
})

gulp.task('mocha', function () {
    gulp.src(paths.tests)
        .pipe(mocha({
            reporter: 'list'
        }))
        .on('error', handleError)
})

gulp.task('watch', function () {
    livereload.listen()
    gulp.watch([paths.styles], ['styles'])
    gulp.watch([paths.js, paths.tests, paths.styles], livereload.changed())
    gulp.watch([paths.js], ['compile'])
})

// Our default test task.
gulp.task('test', ['mocha'])

gulp.task('default', ['lint', 'styles', 'compile', 'watch'])

gulp.task('dist', ['compress', 'lint'])