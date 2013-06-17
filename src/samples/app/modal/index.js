define(['plugins/dialog', './customModal'], function (dialog, CustomModal) {
    return {
        showCustomModal: function() {
            CustomModal.show().then(function(response) {
                dialog.showMessage('You answered "' + response + '".');
            });
        }
    };
});