'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var swig = require('gulp-swig');

gulp.task('sass', function () {
  gulp.src('./src/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./build'));
});

gulp.task('compress', function() {
  return gulp.src('./src/**/*.js')
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.js', ['compress']);
  gulp.watch('./src/**/*.hbs', ['templates']);
  gulp.watch('./src/**/*.html', ['swig']);
});

gulp.task('templates', function(){
  gulp.src('./src/**/*.hbs')
      .pipe(handlebars())
      .pipe(wrap('Handlebars.template(<%= contents %>)'))
      .pipe(declare({
        namespace: 'Auction.templates',
        noRedeclare: true, // Avoid duplicate declarations
      }))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest('build/'));
});

gulp.task('swig', function() {
  gulp.src('./src/index.html')
      .pipe(swig({defaults: { cache: false }}))
      .pipe(gulp.dest('build/'));
});

gulp.task('default', ['sass', 'compress', 'templates', 'swig', 'watch']);