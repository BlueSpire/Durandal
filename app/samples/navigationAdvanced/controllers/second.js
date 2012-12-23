define(function(require) {
    var system = require('durandal/system');

    var ctor = function() {
        this.displayName = 'Second Page';
    };

    ctor.prototype.deactivate = function() {
        system.log('Hello from second\'s deactivate function');
    };

    return ctor;
});