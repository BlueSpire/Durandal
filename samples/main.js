requirejs.config({
    paths: {
        'text': '../../vendor/text',
        'durandal':'../../vendor/durandal/js',
        'plugins' : '../../vendor/durandal/js/plugins',
        'transitions' : '../../vendor/durandal/js/transitions'
    }
});

define('jquery', function(){ return jQuery; });
define('knockout', ko);

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'],  function (system, app, viewLocator) {
    system.debug(true);

    app.title = 'Durandal Samples';

    app.configurePlugins({
        router:true,
        dialog: true,
        widget: {
            kinds: ['expander']
        }
    });

    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot('shell');
    });
});