require.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system');

    //This second set of requires is temporary, until we rewrite a custom mimosa module to handle it.
    require('durandal/messageBox')
    require('durandal/transitions/entrance')
    require('viewmodels/shell')
    require('viewmodels/welcome')
    require('viewmodels/flickr')

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Durandal Starter Kit';

    app.plugins = {
        router:true,
        dialog: true,
        widget: true
    };

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});