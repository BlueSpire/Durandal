var utils = require('./utils');

exports.tasks = {
    jshint:fixupTask(require('./tasks/jshint')),
    uglifyjs:fixupTask(require('./tasks/uglifyjs')),
    rjs:fixupTask(require('./tasks/rjs'))
};

function fixupTask(task){
    if(!task.config){
        task.config = function(){
            var args = Array.prototype.slice.call(arguments);
            var defaultConfig = task.defaultConfig || {};
            args.unshift(defaultConfig);
            return utils.merge.apply(utils, args);
        }
    }

    return task;
}