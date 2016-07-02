'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('sass', function () {
  gulp.src('./public/stylesheets/site/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/site/css'));

    gulp.src('./public/materialize/materialize-src/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./public/materialize/materialize-src/css'));
});

gulp.task('sass:watch', function () {
    //setInterval(function(){
      gulp.src('./public/stylesheets/site/scss/*.scss')
          .pipe(watch('./public/stylesheets/site/scss/*.scss'))
          .pipe(sass())
          .pipe(gulp.dest('./public/stylesheets/site/css'));
    //}, 1000);
});
