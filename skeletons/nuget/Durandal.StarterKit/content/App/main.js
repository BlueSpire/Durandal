requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(['durandal/app', 'durandal/viewLocator', 'durandal/system'],
function(app, viewLocator, system) {

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Durandal Starter Kit';
    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        app.adaptToDevice();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});