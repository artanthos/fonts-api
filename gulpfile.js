const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function(){
    return gulp.src('client/css/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('client/css/compiled/'))
});

gulp.task('watch', function(){
    gulp.watch('css/**/*.scss', ['css']); 
  })