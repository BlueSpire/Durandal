/// <reference path="nodelib/node.js" />
/// <reference path="node_modules/glob/glob.js " />
var source = "../platforms/Microsoft.NET/Nuget/";
var sourceMatch = source + "**/*.nuspec";

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
	var path = require('path');

	var glob = require('glob');
	["*.nupkg", "*.nuspec"].forEach(function (pattern) {
		var files = glob.sync(pattern);
		files.forEach(function (file) {
			fs.unlink(file, function (err) {
				if (err) throw err;
			});
		});
	});

	var nuspecFiles = glob.sync(sourceMatch) || [];
	nuspecFiles.forEach(function (input) {
		var content = fs.readFileSync(input).toString();

		var versionRegex = /(<version>.*?\..*?)\..*?(<\/version>)/gi;
		var dependencyRegex = /(<dependency id="Durandal.*?)(" version="2.0)(.*?)(" \/>)/gi;
		var nameRegex = /(<title>)(.*)(<\/title)/gi;
		var idRegex = /(<id>)(.*)(<\/id>)/gi;
		var fileRegex = /(\<file src=\")/gi;
		var date = new Date();
		var idPrefix = "20";
		var namePrefix = " 2.0"
		var revision = (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
		var build = date.getUTCHours() * 10000 + date.getUTCMinutes() * 100 + date.getUTCSeconds();
		content = content.replace(versionRegex, "$1.{0}.{1}$2".format(revision, build));
		content = content.replace(dependencyRegex, "$1{0}$2.{1}.{2}$4".format(idPrefix, revision, build));
		content = content.replace(nameRegex, "$1$2{0}$3".format(namePrefix));
		content = content.replace(idRegex, "$1$2{0}$3".format(idPrefix));
		content = content.replace(fileRegex, "$1{0}\\".format(path.normalize(path.dirname(input))));
		var output = path.basename(input), content;
		fs.writeFileSync(output, content);
		var spawn = require('child_process').spawn;
		//execute nuget  pack command 
		var pack = spawn("nuget", ["pack", output].concat(process.argv.slice(2)), {
			stdio: 'inherit',
			stderr: 'inherit',
		});
		pack.on("close", flow.add());
		flow.wait();
		console.log("");
	});

	typeof nupackDone == "function" && nupackDone();
});
