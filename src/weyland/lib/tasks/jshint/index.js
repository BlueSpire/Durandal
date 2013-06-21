var log = require('npmlog');

exports.defaultConfig = {
    moduleId:'jshint',
    config:{

    }
};

exports.build = function(config){
    log.info('build', 'jshint');
}