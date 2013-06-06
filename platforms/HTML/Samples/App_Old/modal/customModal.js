define(['durandal/app'], function (app) {
    
    var CustomModal = function() {
        this.input = ko.observable('');
    };

    CustomModal.prototype.ok = function() {
        this.modal.close(this.input());
    };

    CustomModal.prototype.canDeactivate = function () {
        return app.showMessage('Are you sure that\'s your favorite color?', 'Just Checking...', ['Yes', 'No']);
    };

    return CustomModal;
});