define(['durandal/app', './customModal'], function (app, CustomModal) {
    return {
        showCustomModal: function() {
            CustomModal.show().then(function(response) {
                app.showMessage('You answered "' + response + '".');
            });
        }
    };
});