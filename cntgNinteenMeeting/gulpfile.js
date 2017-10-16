var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin'); // html压缩
var minify = require('gulp-minify-css'); //css压缩
var uglify = require('gulp-uglify'); //js压缩
var imagemin = require('gulp-imagemin'); //压缩图片
var concat = require('gulp-concat'); //文件合并
gulp.task('default', function() {
	gulp.start('minifyHtml', 'minifyFont', 'minifyCss', 'minifyJs', 'minifyImg');
});
//压缩html
gulp.task('minifyHtml', function() {
	return gulp.src('index.html')
		.pipe(htmlmin())
		.pipe(gulp.dest('dist'));
});
//压缩css
gulp.task('minifyCss', function() {
	return gulp.src('css/*.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/css'));
});

//压缩字体
gulp.task('minifyFont', function() {
	return gulp.src('font/*')
		.pipe(gulp.dest('dist/font'));
})

//压缩js
gulp.task('minifyJs', function() {
	return gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
})

//压缩图片
gulp.task('minifyImg', function() {
	return gulp.src('img/**/*.png')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
})