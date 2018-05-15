var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');

gulp.task('sass', () => {
    return gulp
        .src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(
            browserSync.reload({
                stream: true
            })
        );
});

gulp.task('watch', ['sass', 'browserSync'], () => {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('minify_js', () =>
    gulp
        .src('app/js/app.js')
        .pipe(
            babel({
                presets: ['env']
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
);

gulp.task('minify_css', function() {
    return gulp
        .src('app/css/styles.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('optimize_images', function() {
    return gulp
        .src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(
            imagemin({
                interlaced: true
            })
        )
        .pipe(gulp.dest('dist/images'));
});

gulp.task('build', ['minify_css', 'minify_js', 'optimize_images'], function() {
    return gulp.src('app/*.html').pipe(gulp.dest('dist'));
});
