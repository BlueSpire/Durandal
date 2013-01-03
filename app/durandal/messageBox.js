define(function() {
    var ctor = function(message, title, options) {
        this.message = message;
        this.title = title || ctor.defaultTitle;
        this.options = options || ctor.defaultOptions;
    };

    ctor.prototype.selectOption = function (dialogResult) {
        this.modal.close(dialogResult);
    };

    ctor.defaultTitle = "Application";
    ctor.defaultOptions = ["Ok"];

    return ctor;
});