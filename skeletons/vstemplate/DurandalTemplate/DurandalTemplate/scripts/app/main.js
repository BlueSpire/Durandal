require.config({
    paths: {
        "text": "vendor/text"
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator');

    //Let's start up Durandal...
    app.start().then(function () {
        //customizing the view location strategy for our app
        viewLocator.convertModuleIdToViewUrl = function (moduleId) {
            return moduleId.replace('viewModel', 'view');
        };

        //make the app fit to the screen on touch devices
        app.makeFit();
        
        //set the root view model for our application
        app.setRoot('viewModels/shell');
    });
});