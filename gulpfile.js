'use strict';

const gulp = require('gulp');
const uglify = require('gulp-uglify');
let sass = require('gulp-sass');

gulp.task('sass', function() {
  return gulp.src('./front/scss/index.scss')
    .pipe(sass.sync())
    .pipe(gulp.dest('./public/css'))
})

gulp.task('copy', function() {
  return gulp.src('./front/simditor.css')
    .pipe(gulp.dest('./public/css'))
})
gulp.task('sass-watch', function() {
  return gulp.watch('./front/scss/*.scss', ['sass'])
});

gulp.task('default', ['copy', 'sass', 'sass-watch'])
