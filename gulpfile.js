"use strict";

var config = require('./gulp.config')();


const gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      uglify = require('gulp-uglify'),
      include = require("gulp-include"),
      concat = require('gulp-concat'),
      purgecss = require('gulp-purgecss'),
      purge_safelist = [
        'scroll-below-header',
        'focus-element',
        'animated',
      ];

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
    .pipe(sass(config.options.develop).on('error', sass.logError))
    .pipe(autoprefixer(config.options.autoprefixer))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.sass.output));
}

function purge() {
    return gulp
    .src(config.sass.base)
    .pipe(sourcemaps.init())
    .pipe(sass(config.options.production).on('error', sass.logError))
    .pipe(autoprefixer(config.options.autoprefixer))
    .pipe(purgecss({ content: ['**/*.php'], safelist: purge_safelist, }))
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
 * @task css
 * @task js
 *
 * watches input raw files for updates and auto runs the appropriate tasks
 */
function watchFilesDevelop() {
    gulp.watch(config.sass.input, css);
    gulp.watch(config.js.input, scripts);
}

/**
 * WATCH task - run 'gulp ready'
 *
 * @task purge
 * @task js
 *
 * watches input raw files for updates and auto runs the appropriate tasks
 */
function watchFilesProduction() {
    gulp.watch(['**/*.php'], purge);
    gulp.watch(config.sass.input, purge);
    gulp.watch(config.js.input, scripts);
}

// define complex tasks
const js = gulp.series(scripts);
const build = gulp.series(purge, scripts);
const watch = gulp.parallel(watchFilesDevelop);
const ready = gulp.parallel(watchFilesProduction);

//export tasks
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.ready = ready;
exports.default = build;

