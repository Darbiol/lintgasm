'use strict';

var glob    = require( 'glob' );
var config  = require( './config' );
var async   = require( 'async' );
var Promise = require( 'bluebird' );
var path    = require( 'path' );
var fs      = require( 'fs' );
var lintgasm = require( '../lintgasm' );
var color   = require( 'colors' );
var Table   = require( 'cli-table' );

function msgTypeExporter () {
	this.result = {};
	this.result.status = color.green( 'PASSED' );

	this.table = new Table( {

		'head' : [ 'MessageType Name', 'Status' ],

		'colWidths' : [ 50, 10 ],

		'chars' : {
			'top'          : '═',
			'top-mid'      : '╤',
			'top-left'     : '╔',
			'top-right'    : '╗',
			'bottom'       : '═',
			'bottom-mid'   : '╧',
			'bottom-left'  : '╚',
			'bottom-right' : '╝',
			'left'         : '║',
			'left-mid'     : '╟',
			'mid'          : '─',
			'mid-mid'      : '┼',
			'right'        : '║',
			'right-mid'    : '╢',
			'middle'       : '│'
		},

		'style' : {
			'head' : [ 'white' ]
		}

	} );
};



msgTypeExporter.prototype.runPromise = function () {
	var self = this;
	var msgArr = [];
	return new Promise( function ( resolve, reject ) {
		self.getFiles( config )
			.then( function ( files ) {
				async.eachSeries( files, function ( fileDir, callback ) {
					self.readFile( fileDir )
						.then( function ( fileContent ) {
							return self.parseMsgType( fileContent );
						} )
						.then( function ( messageType) {
							msgArr.push( messageType )
							callback( null );
						} )
						.catch( function ( error ) {
							reject( error )
						} );
				}, function ( err ) {
					if ( err ) {
						reject( err )
					}
					resolve( msgArr )
				} );
			} )
			.catch( function ( err ) {
				reject( err );
			} );
	} );
}

msgTypeExporter.prototype.run = function ( cb ) {
	var self = this;
	var msgArr = [];
	self.getFiles( config )
		.then( function ( files ) {
			async.eachSeries( files, function ( fileDir, callback ) {
				self.readFile( fileDir )
					.then( function ( fileContent ) {
						return self.parseMsgType( fileContent );
					} )
					.then( function ( messageType) {
						msgArr.push( messageType )
						callback( null );
					} )
					.catch( function ( error ) {
						reject( error )
					} );
			}, function ( err ) {
				if ( err ) {
					reject( err )
				}
				lintgasm.run( msgArr )
					.then( function ( result ) {
						return self.tabulateRresults( result );
					} )
					.then( function () {
						self.showTable();

						if ( cb && ( typeof cb === 'function' ) ) {
							cb( self.result );
						}
					} )
					.catch( function ( err ) {
						throw err;
					} )

			} );
		} )
		.catch( function ( err ) {
			reject( err );
		} );
}

msgTypeExporter.prototype.readFile = function ( dir ) {
	var dirPath = path.join( __dirname, dir );

	return new Promise( function ( resolve, reject ) {
		fs.readFile(  dir, 'utf8', function ( err, data ) {
			if ( err ) {
				reject( err );
			}
			resolve( data );
		} );
	} );
}

msgTypeExporter.prototype.parseMsgType = function ( string ) {
	var start  = string.indexOf( 'config' );
	var fin    = string.indexOf( ';', start );
	var temp   = string.slice( start, fin );

	var begin     = temp.indexOf( '{' )+1;
	var end       = temp.indexOf( '}' );
	var configStr = temp.substring( begin, end ).replace(/\n/g, '' ).replace( /\'/g, '' ).replace( /\t/g, '' ).split( ',' )

	var msgTypeIdx = configStr.containing( 'messageType' );
	var msgType = configStr[ msgTypeIdx ].trim().split( ':' ).pop().trim();

	return new Promise.resolve( msgType );
}

Array.prototype.containing = function ( query ) {
	var containingIndex = -1;
	this.forEach( function ( data, index ) {
		if ( data.indexOf( query ) > -1 && containingIndex ) {
			containingIndex = index;
		}
	} );
	return containingIndex;
}
msgTypeExporter.prototype.getFiles = function () {
	var self = this;
	return new Promise( function ( resolve, reject ) {
		glob( config.directory, function ( err, files ) {
			if ( err ) {
				reject( err );
			} else {
				resolve( files );
			}
		} );
	} );
}

msgTypeExporter.prototype.getConfig = function ( file ) {
	var fileConfig = require( '../.' + file ).config;
	console.log( fileConfig );
	return new Promise( function ( resolve, reject ) {
		if ( Object.keys( fileConfig ).length ) {
			resolve( fileConfig );
		} else {
			reject( new Error( 'File does not exists.' ) );
		}
	} );
}

msgTypeExporter.prototype.tabulateRresults = function ( resultArr ) {
	var self = this;
	resultArr.forEach( function ( data, index ) {
		if ( data.result ) {
			self.table.push( [ data.name, color.green( data.status ) ] );
		} else {
			self.table.push( [ data.name, color.red( data.status ) ] );
			self.result.status = color.red( 'FAILED' )
		}
	} );
	return new Promise.resolve();
}

msgTypeExporter.prototype.showTable = function () {
	console.log( this.table.toString() );
}

module.exports = new msgTypeExporter();
