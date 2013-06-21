var log = require('npmlog'),
    util = require('util');

exports.process = function(configs){
    log.info("build", "config", util.inspect(configs, { depth: null, colors:true }));
    log.info("build", "Weyland 'build' doesn't do anything yet...");
};
