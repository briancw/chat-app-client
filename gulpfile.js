/*jslint node: true */

var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var sourcemaps = require('gulp-sourcemaps');
// var closure_compiler = require('gulp-closure-compiler');

var asset_path = 'assets/';

function catch_error(error) {
    console.log(error.toString());
    gutil.beep();
    notifier.notify({
        title: 'Gulp Error',
        message: error.toString(),
    });
    this.emit('end');
}

gulp.task('scss', function() {
    gulp.src(asset_path + '/scss/**/*')
    .pipe(sourcemaps.init())
        .pipe(sass())
    .pipe(sourcemaps.write())
    .on('error', catch_error)
    .pipe(postcss([autoprefixer({browsers: ['last 2 version']})]))
    .on('error', catch_error)
    .pipe(gulp.dest(asset_path + '/compiled'))
    .on('error', catch_error)
    .pipe(concat('all.min.css'))
    .on('error', catch_error)
    .pipe(gulp.dest(asset_path + '/dist'));
});

gulp.task('js', function() {
    return gulp.src(asset_path + '/js/**/*')
        // .pipe(closure_compiler({
        //    compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
        //    fileName: 'all.min.js'
        // }))
        .pipe(concat('all.min.js'))
        .on('error', catch_error)
        .pipe(gulp.dest(asset_path + '/dist'));
});

gulp.task('html', function() {
    // return gulp.src('views/**/*')
    return gulp.src(
        [
            'views/header.html',
            'views/login.html',
            'views/signup.html',
            'views/main.html',
            'views/footer.html'
        ])
        .pipe(concat('index.html'))
        .on('error', catch_error)
        // .pipe(gulp.dest(asset_path + '/dist'));
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    watch(asset_path + '/scss/**/*', function() {
        gulp.start('scss');
    });
    watch(asset_path + '/js/**/*', function() {
        gulp.start('js');
    });
    watch('views/**/*', function() {
        gulp.start('html');
    });
});

// Default Task
gulp.task('default', ['scss', 'js', 'html', 'watch']);
