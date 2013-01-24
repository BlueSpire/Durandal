require.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');

    require('durandal/messageBox')
    require('viewmodels/shell')
    require('viewmodels/welcome')
    require('viewmodels/flickr')
    
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.start().then(function () {
        //Customizing the view location strategy for our app is easy.
        viewLocator.convertModuleIdToViewUrl = function (moduleId) {
            return moduleId.replace('viewmodel', 'view');
        };

        app.adaptToDevice();
        
        //Show the app by setting the root view model for our application.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});