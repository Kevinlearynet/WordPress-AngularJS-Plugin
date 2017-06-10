'use strict';

/**
 * Build Process for LESS + JS
 */
process.chdir( __dirname );
const gulp = require( 'gulp' );
const include = require( 'gulp-include' );
const less = require( 'gulp-less' );
const path = require( 'path' );
const uglify = require( 'gulp-uglify' );
const fsCache = require( 'gulp-fs-cache' );
const pump = require( 'pump' );
const ngAnnotate = require( 'gulp-ng-annotate' );
const autoprefixer = require( 'gulp-autoprefixer' );
const cleanCSS = require( 'gulp-clean-css' );
const rename = require( 'gulp-rename' );
const sourcemaps = require( 'gulp-sourcemaps' );
const fs = require( 'fs' );
const util = require( 'gulp-util' );

// Build tasks
gulp.task( 'less', compileLESS );
gulp.task( 'js', compileJS );
gulp.task( 'default', watch );
gulp.task( 'build', [ 'less', 'js' ] );

// Error handler
function next( error ) {
	if ( !error ) return;
	console.log( error );
}

// Compile JavaScript
function compileJS() {
	var jsCache = fsCache( '.gulp-cache/js' );

	return pump( [
		sourcemaps.init(),
		gulp.src( 'js/main.js' ),
		include( {
			hardFail: true,
			extensions: 'js'
		} ),
		ngAnnotate(),
		jsCache,
		uglify(),
		jsCache.restore,
		sourcemaps.write( './dist/maps' ),
		gulp.dest( './dist/js' )
	], next );
}

// Compile LESS
function compileLESS() {
	return pump( [
		sourcemaps.init(),
		gulp.src( 'less/main.less' ),
		less( {
			paths: [ path.join( __dirname, 'less' ) ]
		} ),
		autoprefixer( {
			browsers: [ 'last 2 versions' ],
			cascade: false
		} ),
		cleanCSS( {
			compatibility: 'ie9'
		} ),
		sourcemaps.write( './dist/maps' ),
		gulp.dest( './dist/css' )
	], next );
}

// Watch files and run tasks if they change
function watch() {
	gulp.watch( [ 'less/*.less', 'js/**/*.less' ], [ 'less' ] );
	gulp.watch( 'js/**/*.js', [ 'js' ] );
}