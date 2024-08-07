const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
// Пакет для удаления файлов.
const del = require('del');
// Модуль для работы с файловой системой (используется при работе с JSON-файлом).
const fs = require('fs');

// Таск для сборки Pug файлов.
gulp.task('pug', function(callback) {
	return gulp.src('./src/pug/pages/**/*.pug')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}) )
		.pipe( pug({
			pretty: true,
			locals: {
				jsonData : JSON.parse( fs.readFileSync('./html-data.json', 'utf8') )
			}
		}) )
		.pipe( gulp.dest('./build/') )
		.pipe( browserSync.stream() )
	callback();
});

// Таск для компиляции SCSS в CSS.
gulp.task('scss', function(callback) {
	return gulp.src('./src/scss/styles.scss')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					sound: false,
					message: err.message
				}
			})
		}) )
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}) )
		.pipe( sourcemaps.write() )
		.pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
		.pipe( gulp.dest('./build/css/') )
		.pipe( browserSync.stream() )
	/*
		Функция должна завершиться,
		поэтому в конце её выполнения вызывается callback.
	*/
	callback();
});


// Копирование Шрифтов.
gulp.task('fonts', function() {
	return gulp.src('src/fonts/*')
		.pipe(gulp.dest('build/fonts'));
	callback();
});

// Копирование Изображений.
gulp.task('copy:img', function(callback) {
	return gulp.src('./src/img/**/*.*')
		.pipe(gulp.dest('./build/img/'));
	callback();
});

// Копирование Скриптов.
gulp.task('copy:js', function(callback) {
	return gulp.src('./src/js/**/*.*')
		.pipe(gulp.dest('./build/js/'));
	callback();
});

// Копирование Значков сайта (favicons).
gulp.task('copy:favicon', function(callback) {
	return gulp.src('./src/*.ico')
		.pipe(gulp.dest('./build/'));
	callback();
});

// Слежение за HTML и CSS и обновление браузера.
gulp.task('watch', function() {
	watch( ['./build/js/**/*.*', './build/img/**/*.*', 'copy:favicon'], gulp.parallel(browserSync.reload) );
	watch('./src/scss/**/*.scss', function(){
		setTimeout( gulp.parallel('scss'), 1000 );
	});

	// Слежение за PUG и сборка страниц
	watch(['./src/pug/**/*.pug', './html-data.json'], gulp.parallel('pug'));

	// Следим за картинками, скриптами и иконками сайта, и копируем их в build.
	watch('./src/img/**/*.*', gulp.parallel('copy:img'));
	watch('./src/js/**/*.*', gulp.parallel('copy:js'));
	watch('./src/*.ico', gulp.parallel('copy:favicon'));
});

// Задача для старта сервера из папки build
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
});

// Таск для очищения папки build.
gulp.task('clean:build', function() {
    return del('./build')
});

// Дефолтный таск (таск по умолчанию).
gulp.task(
	'default', 
	gulp.series( 
		gulp.parallel('clean:build'),
		gulp.parallel('scss', 'pug', 'copy:img', 'copy:js', 'copy:favicon', 'fonts'), 
		gulp.parallel('server', 'watch') 
		) 
	);