var express = require('express'),
	path = require('path'),
	fs = require('fs');

function isValidPath(p) {
	try{
		fs.statSync(p);
		return true;
	}catch(e) {
		console.warn("Invalid path: '"+p+"'");
		return false;
	}
}

function serve(options) {

	options = options || {};
	options.port = options.port || 8080;
	options.pathsToServe = options.pathsToServe;

	if(options.pathsToServe == 0) {
		options.pathsToServe.push(".");
	}

	var app = express();

	var s = options.pathsToServe
		.map(function(pathToServe) {
			return path.resolve(pathToServe);
		})
		.filter(isValidPath);
	s.forEach(function(pathToServe) {
			app.use(express.static(pathToServe));
			console.log("Serving '"+pathToServe+"'.");
		});

	if(!s || s.length==0){
		console.error("Can't serve because there are no valid paths.");
		return null;
	}
	app.listen(options.port);
	console.log("Serving @ localhost:"+options.port);
	console.log("Hit Ctrl+C to stop.");

	return app;
}

module.exports = serve;