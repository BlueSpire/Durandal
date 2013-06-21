var build = require('./index'),
    program = require('commander'),
    path = require('path'),
    fs = require('fs'),
    dsl = require('../../dsl');

var command = program
    .command('build')
    .description('Build your app for deploy.')
    .option('-c, --config <path>', 'the path to the weyland-config.js file')
    .action(doBuild);

function doBuild(){
    var configPath = command.config || path.join(process.cwd(), "weyland-config.js");
    require(configPath).config(dsl);
    build.process(dsl.buildConfigurations);
};