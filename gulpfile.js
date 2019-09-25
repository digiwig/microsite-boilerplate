"use strict";

var config = require('./gulp.config')();


const gulp = require('gulp'),
      sass = require('gulp-sass'),
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
function css() {
    return gulp
    .src(config.sass.base)
    .pipe(sourcemaps.init())
    .pipe(sass(config.options.sass).on('error', sass.logError))
    .pipe(autoprefixer(config.options.autoprefixer))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.sass.output));
}

/**
 * JS compilation
 *
 * compiles and uglifies js
 */
function scripts() {
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
}

/**
 * WATCH task - run 'gulp watch'
 *
 * @task scss
 * @task js
 *
 * watches input raw files for updates and auto runs the appropriate tasks
 */
function watchFiles() {
    gulp.watch(config.sass.input, css);
    gulp.watch(config.js.input, scripts);    
}

// define complex tasks
const js = gulp.series(scripts);
const build = gulp.series(css, scripts);
const watch = gulp.parallel(watchFiles);

//export tasks
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = build;
