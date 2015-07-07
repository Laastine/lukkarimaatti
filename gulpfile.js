var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    concatCss = require('gulp-concat-css'),
    browserify = require('browserify'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer')

var paths = {
    js: './src/main/js/main.js',
    css: './src/main/styles/main.css',
    tests: './src/test/webapp/*.js',
    styles: './src/main/webapp/*.css',
    dist: './src/main/webapp/'
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
        .pipe(gulp.dest(paths.dist))
        .pipe(livereload())
})

gulp.task('styles', function () {
    gulp.src(paths.css)
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

gulp.task('watch', function () {
    livereload.listen()
    gulp.watch([paths.styles], ['styles'])
    gulp.watch([paths.js, paths.tests, paths.styles], livereload.changed())
    gulp.watch([paths.js], ['compile'])
})

// Our default test task
gulp.task('default', ['lint', 'styles', 'compile', 'watch'])

gulp.task('dist', ['compress', 'lint', 'styles'])