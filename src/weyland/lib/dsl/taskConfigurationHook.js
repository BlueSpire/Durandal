var utils = require('../utils');

var ctor = function(builder){
    this.builder = builder;
}

function createTaskConfigurer(taskName){
    var task = require('../tasks/' + taskName);

    ctor.prototype[taskName] = function(config){
        var args = Array.prototype.slice.call(arguments);
        var defaultConfig = task.defaultConfig || {};
        args.unshift(defaultConfig);
        var finalConfig = utils.merge.apply(utils, args);
        this.builder.config.tasks.push(finalConfig);
        return this.builder;
    };
}

['jshint', 'uglifyjs', 'rjs']
    .forEach(function(taskName){ createTaskConfigurer(taskName); });

module.exports = ctor;