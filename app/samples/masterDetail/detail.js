define(function(require) {
    var system = require('durandal/system');

    var ctor = function(name, description) {
        this.name = name;
        this.description = description;
    };

    ctor.prototype.activate = function() {
        system.log("Activating " + this.name);
    };

    return ctor;
});