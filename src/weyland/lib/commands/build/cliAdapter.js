var build = require('./index'),
    program = require('commander'),
    path = require('path'),
    fs = require('fs'),
    DSL = require('../../dsl');

var command = program
    .command('build')
    .description('Build your app for deploy.')
    .option('-c, --config <path>', 'the path to the weyland-config.js file')
    .action(doBuild);

function doBuild(){
    var configPath = command.config || path.join(process.cwd(), "weyland-config.js");
    var config = require(configPath);
    var buildConfigurations = config.build;

    if(!buildConfigurations){
        var dsl = new DSL();
        config.config(dsl);
        buildConfigurations = dsl.buildConfigurations;
    }

    build.process(program, buildConfigurations);
};