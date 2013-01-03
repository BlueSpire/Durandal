require.config({
    paths: {
        "text": "vendor/text"
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator');

    app.start().then(function() {
        viewLocator.convertModuleIdToViewUrl = function (moduleId) {
            return moduleId.replace('viewModel', 'view').replace('controller', 'view');
        };

        app.makeFit();
        app.setRoot('viewModels/shell');
    });
});