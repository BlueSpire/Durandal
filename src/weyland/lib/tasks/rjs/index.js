var log = require('npmlog');

exports.defaultConfig = {
    moduleId:'rjs',
    config:{

    }
};

exports.build = function(config){
    log.info('build', 'rjs');
}