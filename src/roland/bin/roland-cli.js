#!/usr/bin/env node

;(function(){ // wrapper in case we're in module_context mode
    var program, pack;

    program = require('commander');
    pack = require('../package.json');
    program.version(pack.version);
    process.title = "roland"

    //setup commands and options
    console.log('Roland ' + pack.version + " doesn't do anything yet...");

    program.parse(process.argv);
})()