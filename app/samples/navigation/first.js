define(function(require) {
    var system = require('durandal/system');

    return {
        displayName: 'First Page',
        activate: function() {
            system.log('Hello from first\'s activate function');
        }
    };
});