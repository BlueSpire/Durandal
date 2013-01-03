define(function(require) {
    var navigation = require('infrastructure/navigation'),
        viewModel = require('durandal/viewModel');

    var activeItem = viewModel.activator();

    navigation.addRoute('first', 'controllers/first', 'First');
    navigation.addRoute('second', 'controllers/second', 'Second');
    navigation.start(activeItem, 'first');

    var shell = {
        displayName: "Durandal",
        activeItem: activeItem,
        navigation: navigation
    };

    return shell;
});