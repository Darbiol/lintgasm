'use strict';

var lintgasm = require( './lib/lintgasm/' );
var msgTypeExp = require( './lib/msgTypeExporter' );
var Promise = require( 'bluebird' );

msgTypeExp.run( function ( result ) {
	console.log( 'The Linting has ' + result.status + '.' )
} );

