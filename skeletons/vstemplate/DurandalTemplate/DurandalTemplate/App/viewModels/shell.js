define(function(require) {
    var router = require('infrastructure/router'),
        viewModel = require('durandal/viewModel'),
        app = require('durandal/app');

    var shell = {
        activeItem: viewModel.activator(),
        router: router,
        search: function () {
            app.showMessage('Search not yet implemented...');
        }
    };
    
    router.mapRoute('first', 'viewModels/first', 'First');
    router.mapRoute('second', 'viewModels/second', 'Second');
    router.enable(shell.activeItem, 'first');

    return shell;
});