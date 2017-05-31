/**
 * Auto-version Strings for HTML
 * 
 * Inject Query Strings into HTML for auto-versioning
 */
'use strict';

var fs = require( 'fs' );
var through = require( 'through2' );
var gutil = require( 'gulp-util' );
var path = require( 'path' );
var md5 = require( 'md5' );
var pluginName = 'inject-version';
var defaults = {
	prepend: 'v',
	append: '',
	replace: '%%GULP_INJECT_VERSION%%'
};

// Generate version string
var findVersion = function( tag, filename ) {
	return new Promise( function( resolve, reject ) {
		var filepath = path.resolve( __dirname, '../', filename );
		var src = filename.substring( 1 );

		fs.stat( filepath, function( err, stats ) {
			if ( err ) return reject( err );

			var hash = md5( stats.mtime );

			return resolve( {
				find: tag,
				replace: src + '?v=' + hash
			} );
		} );
	} );
};

module.exports = function( opts ) {
	var inject = function( file, encoding, callback ) {
		if ( file.isNull() )
			return callback( null, file );

		if ( file.isStream() )
			return callback( new gutil.PluginError( pluginName, 'doesn\'t support Streams' ) );

		var handleError = function( err ) {
			callback( new gutil.PluginError( pluginName, err.toString() ) );
		};

		if ( !opts ) {
			var err = new Error( 'No replacement key/value combinations provided.' );
			return handleError( err );
		}

		// File versioning
		var replaceVersions = function( version ) {
			file.contents = new Buffer( file.contents.toString().replace( version.find, version.replace ) );
			callback( null, file );
		};

		for ( var key in opts.files ) {
			findVersion( key, opts.files[ key ] ).then( replaceVersions ).catch( handleError );
		}

		// String replacements
		var replaceStrings = function( find, replace ) {
			file.contents = new Buffer( file.contents.toString().replace( new RegExp( find, 'g' ), replace ) );
		};

		for ( var key in opts.strings ) {
			replaceStrings( key, opts.strings[ key ] );
		}
	};

	return through.obj( inject );
};