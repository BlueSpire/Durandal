define(function() {
    var MessageBox = function(message, title, options) {
        this.message = message;
        this.title = title || MessageBox.defaultTitle;
        this.options = options || MessageBox.defaultOptions;
    };

    MessageBox.prototype.selectOption = function(dialogResult) {
        this.window.close(dialogResult);
    };

    MessageBox.defaultTitle = "Application";
    MessageBox.defaultOptions = ["Ok"];

    return MessageBox;
});