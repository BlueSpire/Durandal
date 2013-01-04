define(function(require) {
    var navigation = require('infrastructure/navigation'),
        viewModel = require('durandal/viewModel'),
        app = require('durandal/app');

    var activeItem = viewModel.activator();

    navigation.addRoute('first', 'viewModels/first', 'First');
    navigation.addRoute('second', 'viewModels/second', 'Second');
    navigation.start(activeItem, 'first');

    var shell = {
        displayName: "Durandal",
        activeItem: activeItem,
        navigation: navigation,
        search: function () {
            app.showMessage('Not implemented...');
        }
    };

    return shell;
});