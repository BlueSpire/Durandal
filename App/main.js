requirejs.config({
    paths: {
        'text': 'durandal/amd/text',
        'knockout': '../Scripts/knockout-2.2.1',
        'bootstrap': '../Scripts/bootstrap',
        'jquery': '../Scripts/jquery-1.9.1'
    },
    shim: {
        'knockout': {
            exports: 'ko'
        },
        'jquery': {
            exports: '$'
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: '$.support.transition' // just picked one
        }
    }
});

define(['durandal/app', 'durandal/system', 'durandal/viewLocator'],
  function (app, system, viewLocator) {
    
    system.debug(true);
    
    app.title = 'Durandal Samples';
    app.start().then(function () {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        app.setRoot('samples/shell');
    });
});