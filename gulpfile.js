// task configurations
var config = require('./gulp.config')();

// task package dependencies
var gulp = require('gulp'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    include = require("gulp-include"),
    concat = require('gulp-concat');

/**
 * SCSS -> CSS compilation
 *
 * compiles scss syntax to css
 * autoprefixes the content
 */
gulp.task('scss', function () {
    return gulp
        .src(config.sass.base)
        .pipe(sourcemaps.init())
        .pipe(scss(config.options.sass).on('error', scss.logError))
        .pipe(autoprefixer(config.options.autoprefixer))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.sass.output));
});

/**
 * JS compilation
 *
 * compiles and uglifies js
 */
gulp.task('js', function(){
    return gulp
        .src(config.js.base)
        .pipe(concat('app.js'))
        .pipe(include({
            extensions: "js",
            hardFail: true,
            includePaths: [
                __dirname + "/node_modules",
                __dirname + "/js"
            ]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(config.js.output));
});

/**
 * WATCH task - run 'gulp watch'
 *
 * @task scss
 * @task js
 *
 * watches input raw files for updates and auto runs the appropriate tasks
 */
gulp.task('watch', ['js', 'scss'], function(){
  gulp.watch(config.sass.input, ['scss']);
  gulp.watch(config.js.input, ['js']);
});


/**
 * DEFAULT task - run 'gulp'
 *
 * @task scss
 * @task js
 */
gulp.task('default', ['scss', 'js']);
