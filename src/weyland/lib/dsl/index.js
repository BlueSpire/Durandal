var BuildConfigurationBuilder = require('./buildConfigurationBuilder');

exports.buildConfigurations = [];
exports.build = function(name){
    var builder = new BuildConfigurationBuilder(name);
    exports.buildConfigurations.push(builder.config);
    return builder;
};