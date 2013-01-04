define(function (require) {
    var system = require('durandal/system');
    
    var ctor = function() {
        this.displayName = 'Second Page';
    };

    ctor.prototype.activate = function () {
        return system.defer(function (dfd) {
            //simlulating an async screen activation that might load data from server
            setTimeout(function () {
                dfd.resolve();
            }, 2000);
        }).promise();
    };

    return ctor;
});