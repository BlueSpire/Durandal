var build = require('./index'),
    program = require('commander'),
    path = require('path');

var command = program
    .command('build')
    .description('Build your app for deploy.')
    .option('-c, --config <path>', 'the path to the configuratoin file')
    .action(doBuild);

function doBuild(){
    var configPath = command.config || path.join(process.cwd(), "weyland-config.json");

    console.log(configPath);
    build.invoke();
};