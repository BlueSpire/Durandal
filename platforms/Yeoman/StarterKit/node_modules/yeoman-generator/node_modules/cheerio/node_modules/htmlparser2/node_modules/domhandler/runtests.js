var fs = require("fs"),
    path = require("path"),
    assert = require("assert"),
    Parser = require("htmlparser2").Parser,
    Handler = require("./");

var basePath = path.resolve(__dirname, "tests"),
    chunkSize = 5;

fs
.readdirSync(basePath)
.filter(RegExp.prototype.test, /\.json$/) //only allow .json files
.map(function(name){
	return path.resolve(basePath, name);
})
.map(require)
.forEach(function(test){
	console.log("Testing:", test.name);

	var handler = new Handler(function(err, dom){
		assert.ifError(err);
		compare(test.expected, dom);
	}, test.options.handler);

	var data = test.html;

	var parser = new Parser(handler, test.options.parser);

	//first, try to run the test via chunks
	for(var i = 0; i < data.length; i+=chunkSize){
		parser.write(data.substring(i, i + chunkSize));
	}
	parser.done();

	//then parse everything
	parser.parseComplete(data);
});

console.log("\nAll tests passed!");

function compare(expected, result){
	assert.equal(typeof expected, typeof result, "types didn't match");
	if(typeof expected !== "object" || expected === null){
		assert.strictEqual(expected, result, "result doesn't equal expected");
	} else {
		for(var prop in expected){
			assert.ok(prop in result, "result didn't contain property " + prop);
			compare(expected[prop], result[prop]);
		}
	}
}