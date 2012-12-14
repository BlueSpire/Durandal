define(["require", "exports", 'durandal/app'], function(require, exports, __durandalApp__) {
    var durandalApp = __durandalApp__;

    var app1;
    app1 = durandalApp;
    var app;
    app = app1;
    var Shell = (function () {
        function Shell() {
            var _this = this;
            this.name = ko.observable();
            this.displayName = ko.observable();
            this.canSayHello = ko.computed(function () {
                return _this.name() ? true : false;
            });
        }
        Shell.prototype.sayHello = function () {
            app.showMessage("Hello " + this.name(), "Greetings");
        };
        return Shell;
    })();
    exports.Shell = Shell;    
})
//@ sourceMappingURL=shell.js.map
