require.config({
    paths: {
        "text": "vendor/text"
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');
    
    //turn debugging on
    system.debug(true);

    //Let's start up Durandal...
    app.start().then(function () {
        //Customizing the view location strategy for our app is easy.
        viewLocator.convertModuleIdToViewUrl = function (moduleId) {
            return moduleId.replace('viewModel', 'view');
        };

        //Here, we make the app fit to the screen for touch devices.
        app.preventBodyScroll();
        
        //Show the app by setting the root view model for our application.
        app.setRoot('viewModels/shell');
    });
});