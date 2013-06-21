var TaskConfigurationHook = require('./taskConfigurationHook');

var ctor = function(name){
    this.config = {
        name:name,
        tasks:[]
    }

    this.task = new TaskConfigurationHook(this);
};

module.exports = ctor;