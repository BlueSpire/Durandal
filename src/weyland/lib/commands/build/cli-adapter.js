var build = require('./index'),
    program = require('commander'),
    path = require('path'),
    fs = require('fs');

var command = program
    .command('build')
    .description('Build your app for deploy.')
    .option('-c, --config <path>', 'the path to the configuratoin file')
    .action(doBuild);

function doBuild(){
    var configPath = command.config || path.join(process.cwd(), "weyland-config.json");

    fs.readFile(configPath, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        build.invoke(JSON.parse(data));
    });
};