define(function(require) {
    var router = require('plugins/router');

    var shell = {
        displayName: "Navigation",
        router: router
    };

    router.mapAuto('samples/navigation/viewmodels');
    router.enable('first');

    return shell;
});