require.config({
    paths: {
        'text': 'durandal/amd/text'
    }
});

define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator');

    system.debug(true);

    //Only used by navigation sample.
    viewLocator.convertModuleIdToViewUrl = function (moduleId) {
        return moduleId.replace('viewmodels', 'views');
    };
    
    //Only used by view composition sample.
    viewLocator.convertViewUrlToAreaUrl = function (area, viewUrl) {
        return 'samples/viewComposition/' + viewUrl;
    };

    app.start().then(function() {
        app.adaptToDevice();
        app.setRoot('samples/widgets/shell');
    });
});