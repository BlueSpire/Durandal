define(function(require) {
    var system = require('durandal/system');
    var viewModel = require('durandal/viewModel');

    var obj = {
        displayName: 'Second Page',
        deactivate: function() {
            system.log('Hello from second\'s deactivate function');
        }
    };

    viewModel.enableViewChaching(obj); //demonstrates a singleton module which caches it's view after creation

    return obj;
});