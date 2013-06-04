/*global phantom, require, runTests*/
var fs = require('fs'),
    page = require('webpage').create(),
    specFiles;

specFiles = fs.list('specs')
    .filter(function(item) {
        return item.indexOf('spec.js') !== -1;
    })
    .map(function(item) {
        return 'specs/' + item.substring(0, item.length - 3);
    });

console.log('Running spec files: ' + specFiles);

page.onConsoleMessage = function(msg) {
    console.log(msg);

    if (msg === "ConsoleReporter finished") {
        phantom.exit();
    }
};

page.onLoadFinished = function () {
    page.evaluate(function (specFiles) {
        runTests(specFiles);
    }, specFiles);
};

page.open('spec.html');