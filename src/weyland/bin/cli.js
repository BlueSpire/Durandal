#!/usr/bin/env node

;(function(){ // wrapper in case we're in module_context mode
    var program = require('commander'),
        pack = require('../package.json'),
        errorHandler = require('../lib/utils/errorHandler');

    process.title = "weyland"
    process.on("uncaughtException", errorHandler);

    program.version(pack.version);
    program.option('-v --verbose', 'use verbose logging');

    require('../lib/commands/build/cliAdapter');

    //display help if command is missing
    if (process.argv.length === 2 || (process.argv.length > 2 && process.argv[2] === '--help')) {
        process.argv[2] = '--help';
    }

    program.parse(process.argv);
})()