define([
    'durandal/app'
], function (app) {
    return new Shell(app);
});
var Shell = (function () {
    function Shell(app) {
        var _this = this;
        this.app = app;
        this.name = ko.observable();
        this.displayName = ko.observable();
        this.canSayHello = ko.computed(function () {
            return _this.name() ? true : false;
        });
    }
    Shell.prototype.sayHello = function () {
        this.app.showMessage("Hello " + this.name(), "Greetings");
    };
    return Shell;
})();
//@ sourceMappingURL=shell.js.map
