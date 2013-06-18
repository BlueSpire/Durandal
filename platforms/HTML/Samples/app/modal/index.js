define('modal/index', ['durandal/app', 'modal/customModal'], function (app, CustomModal) {
    return {
        showCustomModal: function() {
            CustomModal.show().then(function(response) {
                app.showMessage('You answered "' + response + '".');
            });
        }
    };
});