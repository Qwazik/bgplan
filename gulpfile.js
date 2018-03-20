"use strict"

const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const prefixer = require('gulp-autoprefixer');
const notify = require("gulp-notify");
const imagemin = require("gulp-imagemin");
const pug = require('gulp-pug');
const newer = require('gulp-newer');
const cached = require('gulp-cached');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');
const gulpIf = require('gulp-if');
const spritesmith = require('gulp.spritesmith');
const del = require('del');
const reload = browserSync.reload;
const proxy = ''; //////////////// ----indev
const ftp = {

}; //////////////// ----indev

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var path = {
	build: {
		pug: 'build/',
		js: {
			common: 'build/js/'
		},
		css: 'build/css/',
		fonts: 'build/fonts/',
		icons: 'src/img/',
		img: 'build/img/'
	},
	src: {
		pug: 'src/pug/!(_)*.pug',
		js: {
			common: 'src/js/**/*'
		},
		css: 'src/scss/**/*.scss',
		fonts: 'src/fonts/**/*',
		icons: 'src/icons/*.png',
		img: 'src/img/**/*.{png,jpg,svg}'
	},
	watch: {
		pug: 'src/pug/*.pug',
		includes: 'src/pug/includes/*.pug',
		js: {
			common: 'src/js/**/*.js',
		},
		css: 'src/scss/**/*.scss',
		fonts: 'src/fonts/**/*',
		icons: 'src/icons/**/*',
		img: 'src/img/**/*'
	}
};

/*-------------------------------------------------*/
/*  server
/*-------------------------------------------------*/
gulp.task("server", function(){
	browserSync({
		server: {
			baseDir: "./build"
		},
		host: 'localhost',
		port: 3000
	});
});

/*-------------------------------------------------*/
/*  pug
/*-------------------------------------------------*/
gulp.task('build:pug', function(){
	var YOUR_LOCALS = {};
	return gulp.src(path.src.pug, {since: gulp.lastRun('build:pug')})
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Jade',
					message: err.message
				}
			})
		}))
		.pipe(pug({
			locals: YOUR_LOCALS,
			pretty: true
		}))
		.pipe(gulp.dest(path.build.pug))
		.pipe(browserSync.stream())
});

/*-------------------------------------------------*/
/*  pug includes
/*-------------------------------------------------*/
gulp.task('build:includes', function(){
	var YOUR_LOCALS = {};
	return gulp.src(path.src.pug)
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'JadeIncludes',
					message: err.message
				}
			})
		}))
		.pipe(pug({
			locals: YOUR_LOCALS,
			pretty: true
		}))
		.pipe(gulp.dest(path.build.pug))
		.pipe(browserSync.stream())
});

/*-------------------------------------------------*/
/*  javascript
/*-------------------------------------------------*/
gulp.task('build:js', function(){
	return gulp.src(path.src.js.common, {since: gulp.lastRun('build:js')})
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'JS',
					message: err.message
				}
			})
		}))
		.pipe(gulp.dest(path.build.js.common))
		.pipe(browserSync.stream());
});

/*-------------------------------------------------*/
/*  styles
/*-------------------------------------------------*/
gulp.task('build:css', function(){
	return gulp.src(path.src.css, {since: gulp.lastRun('build:css')})
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass())
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(prefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.stream())
});

/*-------------------------------------------------*/
/*  images
/*-------------------------------------------------*/
gulp.task('build:img', function(){
	return gulp.src(path.src.img)
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Images',
					message: err.message
				}
			})
		}))
		.pipe(cached())
        .pipe(gulp.dest(path.build.img))
});

/*-------------------------------------------------*/
/*  imagemin
/*-------------------------------------------------*/
gulp.task('build:imagemin', function(){
	return gulp.src(path.build.img+'**/*.{png,svg,jpg,gif}')
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'ImagesMinifier',
					message: err.message
				}
			})
		}))
		.pipe(cached())
		.pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({
		        plugins: [
		            {removeViewBox: true},
		            {cleanupIDs: false}
		        ]
		    })
		]))
        .pipe(gulp.dest(path.build.img))
});

/*-------------------------------------------------*/
/*  fonts
/*-------------------------------------------------*/
gulp.task('build:fonts', function(){
	return gulp.src(path.src.fonts)
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Fonts',
					message: err.message
				}
			})
		}))
		.pipe(newer(path.src.fonts))
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browserSync.stream());
});

/*-------------------------------------------------*/
/*  sprite
/*-------------------------------------------------*/
gulp.task('build:sprite', function (callback) {
  var spriteData = gulp.src(path.src.icons)
  		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
	  .pipe(newer(path.src.icons)).pipe(spritesmith({
	    imgName: 'icon-set.png',
	    cssName: 'icon-set.scss',
	    imgPath: '../img/icon-set.png',
	    cssVarMap: function (sprite) {
		  sprite.name = 'icon-' + sprite.name;
		}
	  }))
	  spriteData.img.pipe(gulp.dest(path.build.icons));
	  spriteData.css.pipe(gulp.dest('src/scss'));
	  callback();
});


/*-------------------------------------------------*/
/*  clean
/*-------------------------------------------------*/
gulp.task('clean', function(callback){
	cached.caches = {};
	del(['build/**/*', '!build/libs', '!.git']).then(paths => {
    	callback();
    });
	
});


/*-------------------------------------------------*/
/*  build
/*-------------------------------------------------*/
gulp.task('build', gulp.parallel(
	'build:pug',
	'build:css',
	'build:js',
	'build:fonts',
	gulp.series(
		'build:sprite',
		'build:img',
		'build:imagemin'
	)
));

gulp.task('zip', function(){
	return gulp.src('build/**/*')
        .pipe(zip('build.zip'))
        .pipe(gulp.dest('.'))
});

gulp.task('watch', function(){
	gulp.watch(path.watch.pug, gulp.series('build:pug'));
	gulp.watch(path.watch.includes, gulp.series('build:includes'));
	gulp.watch(path.watch.css, gulp.series('build:css'));
	gulp.watch(path.watch.js.common, gulp.series('build:js'));
	gulp.watch(path.watch.icons, gulp.series('build:sprite'))
		.on('change', function(){
			browserSync.reload();
		})
		.on('add', function(){
			browserSync.reload();
		});
	gulp.watch(path.watch.img, gulp.series('build:img'))
		.on('change', function(){
			browserSync.reload();
		})
		.on('add', function(){
			browserSync.reload();
		})
		.on('unlink', function(path, stats){
			cached.caches = {};
			del(path.replace('src','build')).then(()=>{
				gulp.series('build:img');
				browserSync.reload();
			});
		});
	gulp.watch(path.watch.fonts, gulp.series('build:fonts'));
});

gulp.task('default', gulp.series(
	'clean',
	'build',
	gulp.parallel('watch', 'server')
));
