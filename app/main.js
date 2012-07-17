define(function(require) {
    var app = require('durandal/app');

    app.start().then(function() {
        app.makeFit();
        app.setRoot('samples/navigation/shell');
    });
});