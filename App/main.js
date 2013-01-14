require.config({
    paths: {
        'text': 'vendor/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator');

    system.debug(true);

    viewLocator.convertModuleIdToViewUrl = function (moduleId) {
        return moduleId.replace('viewmodels', 'views');
    };

    app.start().then(function() {
        app.adaptToDevice();
        app.setRoot('samples/navigation/shell');
    });
});