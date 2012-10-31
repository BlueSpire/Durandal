define(function(require) {
    var system = require('durandal/system');
    
    return {
        displayName:'Second Page',
        deactivate: function() {
            system.log('Hello from second\'s deactivate function');
        }
    };
});