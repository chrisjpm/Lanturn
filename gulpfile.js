'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./public/stylesheets/site/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/site/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./public/stylesheets/site/sass/**/*.scss', ['sass']);
});
