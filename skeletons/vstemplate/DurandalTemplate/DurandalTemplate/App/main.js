require.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system'),
        router = require('durandal/plugins/router');
    
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.start().then(function () {
        //If our view model is in a 'viewmodels' folder, looks for the view in a 'views' folder.
        viewLocator.useConvention();
        
        //configure routing
        router.useConvention();
        router.mapNav('welcome');
        router.mapNav('flickr');

        app.adaptToDevice();
        
        //Show the app by setting the root view model for our application.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});