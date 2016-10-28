/**
 * Dev dependencies
 */

var gulp = require('gulp');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

/**
 * File paths
 */

var jsAngularDir = 'app';
var jsAngularScript = jsAngularDir + '.js';
var jsUserScript = 'scripts.js';
var basePath = {
	src: './src',
	dest: './src'
};
var path = {
	css: {
		src: basePath.src + '/assets/css/scss/',
		dest: basePath.dest + '/assets/css/'
	},
	js: {
		src: basePath.src + '/assets/js/',
		dest: basePath.dest + '/assets/js/'
	},
	jsVendor: {
		src: basePath.src + '/assets/js/vendor/',
		dest: basePath.dest + '/assets/js/vendor/'
	},
	jsAngular: {
		src: basePath.src + '/' + jsAngularDir + '/',
		dest: basePath.dest + '/' + jsAngularDir + '/'
	}
};
var jsModuleFile = path.jsAngular.src + 'core/app.module.js';

/**
 * Files object
 * Sets up file source arrays for tasks
 */

var files = {};

files.scssSrc = [path.css.src + '**/*.scss', '!' + path.css.src + '/vendor/**/*.scss'];
files.jsUserSrcAngular = [path.jsAngular.src + '**/*.js', '!' + path.jsAngular.src + jsAngularScript];
files.jsUserSrcAssets = [path.js.src + '**/*.js', '!' + path.js.src + jsUserScript, '!' + path.js.src + 'vendor/*'];
files.jsUserSrcAll = files.jsUserSrcAngular.concat(files.jsUserSrcAssets);
files.jsVendorSrc = [path.jsVendor.src + 'jquery.js', path.jsVendor.src + 'angular.js', path.jsVendor.src + '**/*.js', '!' + path.jsVendor.src + 'modernizr.min.js', '!' + path.jsVendor.src + 'vendor.js'];

/**
 * Run "gulp --prod" to trigger production/build mode
 */

var isProduction = false;

if (gutil.env.prod) {
	isProduction = true;
}

/**
 * function errorHandler(err)
 *
 * @param err {*}
 */
function errorHandler(err){
	gutil.beep();
	gutil.log(gutil.colors.red('Error: '), err.message);
	this.emit('end');
}

/**
 * function styles()
 *
 * Init sourcemaps
 * Compile Sass
 * Run autoprefixer
 * Write sourcemaps
 * Minify (if production)
 * Save
 * 
 * @returns {*}
 */
function styles() {
	return gulp.src(files.scssSrc)
		.pipe(sourcemaps.init())
		.pipe(sass({ style: 'expanded' })).on('error', errorHandler)
		.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 1%'],
			cascade: false
		})).on('error', errorHandler)
		.pipe(sourcemaps.write())
		.pipe(isProduction ? minifyCSS() : gutil.noop() )
		.pipe(gulp.dest(path.css.dest));
}

/**
 * function jsUser()
 *
 * Init sourcemaps
 * Concatenate JS files
 * Write sourcemaps
 * Uglify / minify (if production)
 * Save
 * 
 * @returns {*}
 */
function jsUser() {
	return gulp.src(files.jsUserSrcAssets)
		.pipe(sourcemaps.init())
		.pipe(concat(jsUserScript))
		.pipe(sourcemaps.write())
		.pipe(isProduction ? uglify() : gutil.noop() )
		.pipe(gulp.dest(path.js.dest));
}

/**
 * function jsVendor()
 *
 * Concatenate JS vendor files / libraries
 * Uglify / minify
 * Save
 * 
 * @returns {*}
 */
function jsVendor() {
	return gulp.src(files.jsVendorSrc)
		.pipe(concat('vendor.js'))
		.pipe(isProduction ? uglify() : gutil.noop() )	// to unminify vendor in dev, remove "isProduction" ternary
		.pipe(gulp.dest(path.jsVendor.dest));
}

/**
 * function jsAngular()
 *
 * Init sourcemaps
 * Concatenate Angular JS files
 * Write sourcemaps
 * Uglify / minify (if production)
 * Save
 * 
 * @returns {*}
 */
function jsAngular() {
	return gulp.src([jsModuleFile].concat(files.jsUserSrcAngular))
		.pipe(sourcemaps.init())
		.pipe(concat(jsAngularScript))
		.pipe(sourcemaps.write())
		.pipe(isProduction ? uglify() : gutil.noop() )
		.pipe(gulp.dest(path.jsAngular.dest));
}

/**
 * function serve()
 *
 * Start webserver
 * localhost:8000
 */
function serve() {
	if (isProduction) {
		return;
	}

	connect.server({
		root: 'src',
		port: 8000,
		fallback: 'src/index.html'
	});
}

/**
 * Default build task
 *
 * If not production, watch for file changes and execute the appropriate task
 * Use "gulp --prod" to trigger production/build mode from commandline
 */
function defaultTask() {
	// if no production flag, start watching
	if (isProduction) {
		return;
	}

	// compile SCSS
	gulp.watch(files.scssSrc, ['styles']);

	// compile JS vendor files
	gulp.watch(files.jsVendorSrc, ['jsVendor']);

	// compile JS asset files
	gulp.watch(files.jsUserSrcAssets, ['jsUser']);

	// compile JS Angular files
	gulp.watch(files.jsUserSrcAngular, ['jsAngular']);
}

/**
 * Gulp tasks
 */

gulp.task('styles', styles);
gulp.task('jsUser', jsUser);
gulp.task('jsVendor', jsVendor);
gulp.task('jsAngular', jsAngular);
gulp.task('serve', serve);
gulp.task('js', ['jsVendor', 'jsUser', 'jsAngular']);
gulp.task('default', ['serve', 'styles', 'js'], defaultTask);
