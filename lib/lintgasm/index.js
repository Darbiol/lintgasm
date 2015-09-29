'use strict';

var config  = require( './config' );
var Promise = require( 'bluebird' );

function lintgasm (){}

lintgasm.prototype.run = function ( strArr, callback ) {
	var self  = this;
	var error = new Error( 'Not A valid Input' );
	var result;
	return new Promise( function ( resolve, reject ) {
		if ( Array.isArray( strArr ) ) {
			result = self.iterateArr( strArr );
			resolve( result )
		} else if ( ( typeof strArr ) === 'string' ) {
			result = self.evaluate( strArr );
			resolve( result )
		} else {
			reject( error );
		}
	} );
}
lintgasm.prototype.iterateArr = function ( strArr ) {
	var self = this;
	var resultArr = [];

	strArr.forEach( function ( data, index ) {
		resultArr.push( self.evaluate( data ) );
	} );
	return resultArr;
}


lintgasm.prototype.evaluate = function ( str ) {;
	var testObj  = {};

	testObj.name   = str;
	testObj.result = config.pattern.test( str );

	if( testObj.result ) {
		testObj.status = 'PASSED'
	} else {
		testObj.status = 'FAILED'
	}

	return testObj;
}

module.exports = new lintgasm();
