define(function() {
    var MessageBox = function(message, title, options) {
        this.message = message;
        this.title = title || "Application";
        this.options = options || ["Ok"];
    };

    MessageBox.prototype.selectOption = function(dialogResult) {
        this.window.close(dialogResult);
    };

    return MessageBox;
});