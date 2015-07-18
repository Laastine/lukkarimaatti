var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    browserify = require('browserify'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    hbsfy = require('hbsfy')

var paths = {
    jsMain: './src/main/js/main.js',
    js: './src/main/js/**/*.js',
    templates: ['./src/main/js/templates/header.hbs', './src/main/js/templates/footer.hbs', './src/main/js/templates/search.hbs'],
    css: './src/main/styles/main.css',
    tests: './src/test/webapp/*',
    styles: './src/main/webapp/*.css',
    dist: './src/main/webapp/'
}

function handleError(err) {
    console.log(err.message)
    this.emit('end')
}

gulp.task('compile', function () {
    browserify({
        entries: [paths.jsMain, paths.templates],
        debug: true
    })
        .transform('hbsfy')
        .bundle()
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
    gulp.src(paths.jsMain)
        .pipe(jshint({
            globals: {
                require: false
            },
            asi: true
        }))
        .pipe(jshint.reporter('default'))
})

gulp.task('compressJS', function () {
    browserify({
        entries: [paths.jsMain, paths.templates],
        debug: true
    })
        .transform('hbsfy')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .on('error', handleError)
        .pipe(gulp.dest(paths.dist))
})

gulp.task('stylesCss', function () {
    gulp.src(paths.css)
        .pipe(concatCss("bundle.css"))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.dist))
})

gulp.task('watch', function () {
    livereload.listen()
    gulp.watch(paths.jsMain.concat(paths.templates), ['js']);
    gulp.watch([paths.styles], ['styles'])
    gulp.watch([paths.jsMain, paths.tests, paths.styles, paths.js], livereload.changed())
    gulp.watch([paths.jsMain, paths.js], ['compile'])
})

// Our default task
gulp.task('default', ['lint', 'styles', 'compile', 'watch'])

gulp.task('dist', ['lint', 'stylesCss', 'compressJS'])