var build = require('./index'),
    program = require('commander'),
    path = require('path'),
    fs = require('fs'),
    weyland = require('../../index');

var command = program
    .command('build')
    .description('Build your app for deploy.')
    .option('-c, --config <path>', 'the path to the weyland-config.js file')
    .action(doBuild);

function doBuild(){
    var configPath = command.config || path.join(process.cwd(), "weyland-config.js");
    var config = require(configPath).build(weyland);
    build.invoke(config);
};