define(function(require) {
    var router = require('infrastructure/router'),
        viewModel = require('durandal/viewModel'),
        app = require('durandal/app');

    var shell = {
        activeItem: viewModel.activator(),
        router: router,
        showSpinner: getShowSpinnerComputed(),
        search: function () {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        }
    };
    
    function getShowSpinnerComputed() {
        return ko.computed({
            read: function() {
                return !shell.activeItem() || shell.activeItem.isActivating();
            },
            deferEvaluation: true
        });
    }
    
    router.mapRoute('welcome', 'viewmodels/welcome', 'Welcome');
    router.mapRoute('flickr', 'viewmodels/flickr', 'Flickr');
    router.enable(shell.activeItem, 'welcome');

    return shell;
});