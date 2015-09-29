'use strict';

module.exports = {

	'CAMEL_CASE'  : new RegExp( /^[a-z]*[\w][^\W_]*$/ ),
	'UPPER_CASE'  : new RegExp( /^[A-Z][A-Z0-9]*$/ ),
	'LOWER_CASE'  : new RegExp( /^[a-z][a-z0-9]*$/ ),
	'HYPHEN_CASE' : new RegExp( /^[a-z]+(\-[a-z]+){0,}$/ ),
	'SNAKE_CASE'  : new RegExp( /^[a-z]+(\_[a-z]+){0,}$/ ),
	'PASCAL_CASE' : new RegExp( /^[A-Z]+[\w][^\W_]*$/ ),
	'DOT_CASE'    : new RegExp( /^[a-z]+(\.[a-z]+){0,}$/ )

};
