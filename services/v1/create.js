'use strict';

var Joi = require( 'joi' );

var config = {
	'messageType' : 'v1.consumers.create',

	'validate' : {
		'payload' : Joi.object().keys( {
			'ownerId' : Joi.string().required(),
			'type'    : Joi.string().required()
		} )
	}

};

function handler ( message, send ) {
	// HANDLE CAREFULLY
}

module.exports = {
	'config'  : config,
	'handler' : handler
};
