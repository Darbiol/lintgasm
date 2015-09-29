'use strict';

var Joi = require( 'joi' );

var config = {
	'messageType' : 'v1.method.verify',

	'validate' : {
		'clientId'     : Joi.string().required(),
		'clientSecret' : Joi.string().required()
	}
};

function handler ( message, send ) {
	// put handler here
}

module.exports = {
	'config'  : config,
	'handler' : handler
};
