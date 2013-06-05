define(['durandal/app', './customModal'], function (app, CustomModal) {
    
    return {
        showCustomModal: function() {
            app.showModal(new CustomModal()).then(function(response) {
                app.showMessage('You answered "' + response + '".');
            });
        }
    };
});