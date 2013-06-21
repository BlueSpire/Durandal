var log = require('npmlog');

exports.defaultConfig = {
    moduleId:'uglifyjs',
    config:{

    }
};

exports.build = function(config){
    log.info('build', 'uglifyjs');
}