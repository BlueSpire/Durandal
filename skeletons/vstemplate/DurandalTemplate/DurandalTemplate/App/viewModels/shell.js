define(function(require) {
    var router = require('infrastructure/router'),
        viewModel = require('durandal/viewModel'),
        app = require('durandal/app');

    var shell = {
        activeItem: viewModel.activator(),
        router: router,
        search: function () {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        }
    };
    
    router.mapRoute('welcome', 'viewModels/welcome', 'Welcome');
    router.mapRoute('flickr', 'viewModels/flickr', 'Flickr');
    router.enable(shell.activeItem, 'welcome');

    return shell;
});