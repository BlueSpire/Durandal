define(function (require) {
    var system = require('durandal/system');
    
    var Second = function() {
        this.displayName = 'Second Page';
    };

    //The activator created in the shell calls 'activate' on any view model that it's set to.
    //You can optionally return a promise for async activation.
    //NOTE: All Durandal's async operations return promises and so do all jQuery's ajax functions, so
    //they can be easily composed together and used in async screen activation scenarios.
    Second.prototype.activate = function () {
        return system.defer(function (dfd) {
            //Simulating an async screen activation that might load data from server...
            setTimeout(function () {
                dfd.resolve();
            }, 2000);
        }).promise();
    };

    return Second;
});