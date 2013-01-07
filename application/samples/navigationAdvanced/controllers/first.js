define(function(require) {
    var system = require('durandal/system');

    var ctor = function() {
        this.displayName = 'First Page';
    };

    ctor.prototype.activate = function() {
        system.log('Hello from first\'s activate function');
    };

    return ctor;
});