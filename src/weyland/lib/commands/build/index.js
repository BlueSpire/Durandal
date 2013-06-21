var normalizer = require('../../config-normalizer')

exports.invoke = function(config){
    console.log("Weyland 'build' doesn't do anything yet...");

    config = normalizer.normalize(config);
    console.log(config);
};
