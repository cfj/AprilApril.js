var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('main', function() {
    return gulp.src('AprilApril.js')
    .pipe(rename('AprilApril.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('sound', function() {
    return gulp.src('AprilAprilsound.js')
    .pipe(rename('AprilAprilsound.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['main', 'sound'], function() {});