require.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');
    
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.start().then(function () {
        //If our view model is in a 'viewmodels' folder, looks for the view in a 'view' folder.
        viewLocator.useConvention();

        app.adaptToDevice();
        
        //Show the app by setting the root view model for our application.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});