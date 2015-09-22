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
var del = require('del');
var closure_compiler = require('gulp-closure-compiler');
// var ejs = require('ejs');
// var fs = require('fs');

var asset_path = 'assets/';

function swallowError(error) {

    console.log(error.toString());
    gutil.beep();
    notifier.notify({
        title: 'Gulp Error',
        message: error.toString(),
    });
    this.emit('end');
}

gulp.task('clean', function() {

    del([ asset_path + '/dist/**/*', asset_path + '/css/**/*'], function(err, paths) {

        return gulp.src('assets/scss/**/*.scss')
            .pipe(sass())
            .on('error', swallowError)
            .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
            .on('error', gutil.log)
            .pipe(gulp.dest('assets/css'));
    });

});

gulp.task('scss', function() {
    return gulp.src(asset_path + '/scss/**/*')
        .pipe(sass())
        .on('error', swallowError)
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
        .on('error', swallowError)
        .pipe(gulp.dest(asset_path + '/css'));
});

gulp.task('css', ['scss'], function() {
    return gulp.src(asset_path + '/css/**/*')
        .pipe(concat('all.min.css'))
        .pipe(minify())
        .pipe(gulp.dest(asset_path + '/dist'));
});

gulp.task('js', function() {
    return gulp.src(asset_path + '/js/**/*')
        // .pipe(closure_compiler({
        //    compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
        //    fileName: 'all.min.js'
        // }))
        .pipe(concat('all.min.js'))
        .on('error', gutil.log)
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
        .on('error', gutil.log)
        .pipe(gulp.dest(asset_path + '/dist'));
});

gulp.task('watch', function() {
    watch(asset_path + '/scss/**/*', function() {
        gulp.start('css');
    });
    watch(asset_path + '/js/**/*', function() {
        gulp.start('js');
    });
    watch('views/**/*', function() {
        gulp.start('html');
    });
});

// Default Task
gulp.task('default', ['clean', 'css', 'js', 'html', 'watch']);
