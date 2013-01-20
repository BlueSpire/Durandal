define(function(require) {
    var CustomModal = function() {
        this.input = ko.observable('');
    };

    CustomModal.prototype.ok = function() {
        this.modal.close(this.input());
    };
    
    return CustomModal;
});