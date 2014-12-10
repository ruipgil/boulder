#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2)),
	options;

if( argv.help || argv.h ) {
	console.log("Usage: boulder <file|directory ...> [options]");
	console.log("\t<file|directory ...>", "\t Paths to files and/or directories. Default is the current folder, ./");
	console.log("\t-p, --port", "\t\t Port to listen");
	return;
} else if( argv.v || argv.version ) {
	console.log("v"+require('../package.json').version);
	return;
}

options = {
	port: Number(argv.p || argv.port),
	pathsToServe: argv._
};

require('../index.js')(options);