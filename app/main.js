require.config({
    paths: {
        "text": "vendor/text"
    }
});

define(function(require) {
    var app = require('durandal/app');

    app.start().then(function() {
        app.makeFit();
        app.setRoot('samples/navigationAdvanced/shell');
    });
});