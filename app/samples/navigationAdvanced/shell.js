define(function(require) {
    var frontController = require('samples/navigationAdvanced/frontController'),
        viewModel = require('durandal/viewModel');

    var shell = {
        displayName: "Navigation",
        activeItem: viewModel.activator()
    };

    frontController.initialize(shell.activeItem, 'first');

    return shell;
});