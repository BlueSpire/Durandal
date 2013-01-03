define(function (require) {
    var system = require('durandal/system'),
        modalDialog = require('durandal/modalDialog'),
        MessageBox = require('durandal/messageBox');
    
    var ctor = function() {
        this.displayName = 'Second Page';
    };

    ctor.prototype.activate = function () {
        var loader = new MessageBox('Just a demo of deferred screen nav...', 'Loading', []);
        modalDialog.show(loader);

        return system.defer(function(dfd) {
            setTimeout(function () {
                loader.modal.close();
                dfd.resolve();
            }, 2000);
        }).promise();
    };

    return ctor;
});