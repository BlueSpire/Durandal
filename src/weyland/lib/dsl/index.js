var BuildConfigurationBuilder = require('./buildConfigurationBuilder');

var ctor = function(){
    this.buildConfigurations = [];
}

ctor.prototype.build = function(name){
    var builder = new BuildConfigurationBuilder(name);
    this.buildConfigurations.push(builder.config);
    return builder;
};

module.exports = ctor;