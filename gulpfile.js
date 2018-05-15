var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

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

// gulp.task('js', () => {
//     return gulp.src('app/js/**/*.scss').pipe(gulp.dest('dist/js'));
// });

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
