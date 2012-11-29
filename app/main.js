require.config({
    paths: {
        "text": "lib/text"
    }
});

define(function(require) {
    var app = require('durandal/app');
    var sample = require('samples/hellots/shell');

    app.start().then(function () {
        app.makeFit();
        app.setRoot(new sample.Shell(app));
    });
});