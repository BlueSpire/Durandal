/// <reference path="nupack.js " />

var fs = require('fs');
var glob = require('glob');
var spawn = require('child_process').spawn;
var asyncblock = require('asyncblock');
nupackDone = null;
asyncblock(function (done) {
	nupackDone = done.add();
	require("./nupack.js");
	done.wait();
	//read your apiKeys from apiKey.txt, for example:
	//-Source http://nuget.yourdomain.com {A68DC067-A00F-4D2E-9D45-79E549701E5A}
	//you can have multiple keys, one per line so we'll push on all the provided servers
	var apiKey = "";
	if (fs.existsSync("apiKey.txt")) {
		apiKey = fs.readFileSync("apiKey.txt", "UTF-8") || "";
	}
	//automatically push *.nupkg files
	var files = glob.sync("*.nupkg");
	apiKey.split('\n').forEach(function (apiKey) {
		files.forEach(function (file) {
			//split apiKeys by space as they need to be individual arguments
			var push = spawn("nuget", ["push", file].concat(apiKey.split(' ')), {
				stdio: 'inherit',
				stderr: 'inherit',
			});
			push.on("close", done.add());
		});
	});
	done.wait();
});