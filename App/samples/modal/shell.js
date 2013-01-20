define(function(require) {
    var app = require('durandal/app'),
        CustomModal = require('samples/modal/customModal');

    return {
        showCustomModal: function() {
            app.showModal(new CustomModal()).then(function(response) {
                app.showMessage('You answered "' + response + '".');
            });
        }
    };
});