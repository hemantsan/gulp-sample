var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var cssnano = require('gulp-cssnano');

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

gulp.task('minifyjs', () =>
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

gulp.task('minifycss', function() {
    return gulp
        .src('app/css/styles.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build', ['minifycss', 'minifyjs'], function() {
    return gulp.src('app/*.html').pipe(gulp.dest('dist'));
});
