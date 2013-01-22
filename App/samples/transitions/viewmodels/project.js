define(function(require) {
    var system = require('durandal/system'),
        app = require('durandal/app');

    var ctor = function(name, description) {
        this.name = name;
        this.description = description;
    };
    
    ctor.prototype.activate = function() {
        system.log('Model Activating', this);
    };

    ctor.prototype.canDeactivate = function () {
        return true;
    };

    return ctor;
});