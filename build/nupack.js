/// <reference path="nodelib/node.js" />
/// <reference path="node_modules/glob/glob.js " />
var source = "../platforms/Microsoft.NET/Nuget/Durandal/";
var input = source + "Durandal.nuspec";
var output = "durandal.nuspec";

if (!String.prototype.format) {
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != 'undefined'
			  ? args[number]
			  : match
			;
		});
	};
}

var asyncblock = require('asyncblock');

asyncblock(function (flow) {

	var fs = require('fs');
	var glob = require('glob');
	["*.nupkg", "*.nuspec"].forEach(function (pattern) {
		glob(pattern, function (err, files) {
			files.forEach(function (file) {
				fs.unlink(file, function (err) {
					if (err) throw err;
				});
			});
		});
	});

	fs.readFile(input, flow.set("content"));
	var content = flow.get("content").toString();

	var versionRegex = /(<version>.*?\..*?)\..*?(<\/version>)/gi;
	var nameRegex = /(<title>).*(<\/title)/gi;
	var idRegex = /(<id>).*(<\/id>)/gi;
	var fileRegex = /(\<file src=\")/gi;
	var date = new Date();
	var revision = (date.getUTCMonth()+1) * 100 + date.getUTCDate();
	var build = date.getUTCHours() * 10000 + date.getUTCMinutes() * 100 + date.getUTCSeconds();
	content = content.replace(versionRegex, "$1.{0}.{1}$2".format(revision, build));
	content = content.replace(nameRegex, "$1{0}$2".format("Durandal 2.0"));
	content = content.replace(idRegex, "$1{0}$2".format("durandal20"));
	content = content.replace(fileRegex, "$1{0}".format("..\\platforms\\Microsoft.NET\\Nuget\\Durandal\\"));
	fs.writeFileSync(output, content);


	var exec = require('child_process').exec;
	var cmd = "nuget pack " + output;
	exec(cmd, flow.add());
	var result = flow.wait();
	console.log(result);    // There'll be trailing \n in the output
	typeof nupackDone == "function" && nupackDone();
});