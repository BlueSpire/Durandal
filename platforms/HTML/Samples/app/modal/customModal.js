define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var CustomModal = function() {
        this.input = ko.observable('');
    };

    CustomModal.prototype.ok = function() {
        dialog.close(this, this.input());
    };

    CustomModal.prototype.canDeactivate = function () {
        return dialog.showMessage('Are you sure that\'s your favorite color?', 'Just Checking...', ['Yes', 'No']);
    };

    CustomModal.show = function(){
        return dialog.show(new CustomModal());
    };

    return CustomModal;
});