var express = require('express'),
	path = require('path'),
	fs = require('fs');

function isValid(p) {
	try{
		if(!fs.statSync(p).isDirectory()){
			throw new Error();
		}
		return true;
	}catch(e) {
		console.warn("Invalid directory: '"+p+"'");
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
		.filter(isValid);

	switch(s.length) {
		case 0:
			console.error("Can't serve because there are no valid directories.");
			return null;
		case 1:
			s.forEach(function(pathToServe) {
				app.use(express.static(pathToServe));
				console.log("Serving '"+pathToServe+"'.");
			});
		break;
		default:
			var basenames = {};
			s.forEach(function(pathToServe) {
				var basename = path.basename(pathToServe);
				if(basenames[basename]) {
					console.warn("Cannot serve '"+pathToServe+"', conflicting with '"+basenames[basename]);
				} else {
					basenames[basename] = pathToServe;
					app.use("/"+basename, express.static(pathToServe));
					console.log("Serving '"+pathToServe+"' in /"+basename+".");
				}
			});
	}

	app.listen(options.port);
	console.log("Serving @ localhost:"+options.port);
	console.log("Hit Ctrl+C to stop.");

	return app;
}

module.exports = serve;