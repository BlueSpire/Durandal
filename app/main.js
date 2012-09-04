require.config({
    paths: {
        "text": "lib/text"
    }
});

define(function (require) {    
    var app = require('durandal/app');

    app.start().then(function() {
        app.makeFit();
        app.setRoot('samples/Navigation/shell', 'applicationHostNavigation');
        app.setRoot('samples/Hello/shell', 'applicationHostHello');
    });
});