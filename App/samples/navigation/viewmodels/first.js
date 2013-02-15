define(function(require) {
    var system = require('durandal/system');

    var first = function () {
        this.displayName = 'First Page';
    };

    first.prototype.activate = function() {
        //called by the activator when entering this screen
        system.log('Hello from first\'s activate function');
    };

    return first;
});