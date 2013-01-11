define(function(require) {
    var router = require('plugins/router'),
        viewModel = require('durandal/viewModel');

    var shell = {
        displayName: "Navigation",
        activeItem: viewModel.activator()
    };

    router.mapAuto('samples/navigation/viewmodels');
    router.enable(shell.activeItem, 'first');

    return shell;
});