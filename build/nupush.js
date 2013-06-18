/// <reference path="../platforms/microsoft.net/samples/durandal.samples/scripts/nodelib/node.js" />
/// <reference path="../platforms/microsoft.net/samples/durandal.samples/scripts/jquery-1.9.1.js" />
/// <reference path="node_modules/glob/glob.js " />

var fs = require('fs');
var glob = require('glob');
var exec = require('child_process').exec;
var asyncblock = require('asyncblock');
nupackDone = null;
asyncblock(function (done) {
	nupackDone = done.add();
	require("./nupack.js");
	done.wait();
	console.log("pushing...");
	var apiKey = "";
	if (fs.existsSync("apiKey.txt")) {
		apiKey = fs.readFileSync("apiKey.txt", "UTF-8") || "";
	}
	var files = glob.sync("*.nupkg");
	apiKey.split('\n').forEach(function (apiKey) {
		files.forEach(function (file) {
			var cmd = "nuget push {0} {1}".format(file, apiKey);
			console.log(cmd);
			exec(cmd, done.add());
		});
	});
	console.log(done.wait());
});