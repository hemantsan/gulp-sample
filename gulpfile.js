var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');

let jsStream = [
        './app/js/jquery-3.3.1.slim.min.js',
        './app/js/popper.min.js',
        './app/js/owl.carousel.min.js',
        './app/js/**/*.js'
    ],
    cssStream = './app/css/**/*.css';

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
        .src(jsStream)
        .pipe(
            babel({
                presets: [
                    [
                        'env',
                        {
                            loose: true,
                            modules: false,
                            exclude: ['transform-es2015-typeof-symbol']
                        }
                    ]
                ]
            })
        )
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
);

gulp.task('minify_css', function() {
    return (
        gulp
            .src(cssStream)
            // .pipe(concatCss('site.css'))
            .pipe(cssnano())
            .pipe(gulp.dest('dist/css'))
    );
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

gulp.task('build', ['minify_css', 'minify_js'], function() {
    return gulp
        .src('app/*.html')
        .pipe(
            inject(
                gulp.src(['./dist/css/**/*.css', './dist/js/**/*.js'], {
                    read: false
                }),
                {
                    relative: true
                }
            )
        )
        .pipe(gulp.dest('dist'));
});

gulp.task('inject_assets', () => {
    gulp
        .src('./app/**/*.html')
        .pipe(
            inject(gulp.src(jsStream.concat(cssStream), { read: false }), {
                relative: true
            })
        )
        .pipe(gulp.dest('./app'));
});
