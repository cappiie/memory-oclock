//JS
var gulp = require('gulp');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

var uglify = require('gulp-uglify');
var babel = require('gulp-babel');


var imagemin = require('gulp-imagemin');

//JS
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer({
            cascade: false
        }))
    .pipe(gulp.dest('dist/css'))
});
 
gulp.task('scripts', function() {
  return gulp.src('app/js/*.js')
	.pipe(babel())
    .pipe(concat('app.js'))
	//.pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});


gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|svg|gif)')
  .pipe(imagemin([
		//imagemin.jpegtran({progressive: true}),
		imagemin.jpegtran({progressive: true,quality: '40-70'}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]})
  ]))
  .pipe(gulp.dest('dist/images'))
});

//FONTS
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('videos', function() {
  return gulp.src('app/videos/**/*')
  .pipe(gulp.dest('dist/videos'))
});



//WATCH
gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', gulp.series('sass')); 
  gulp.watch('app/js/**/*.js', gulp.series('scripts')); 
  // autres observations
});





 