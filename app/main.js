require.config({
    paths: {
        "text": "lib/text"
    }
});

define(function(require) {
    var app = require('durandal/app');
    
    //The widget registration below is only necessary if you want to enable the short widget syntax.
    var widget = require('durandal/widget');
    widget.registerKind('accordion');

    app.start().then(function() {
        app.makeFit();
        app.setRoot('samples/viewComposition/shell');
    });
});