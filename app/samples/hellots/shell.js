define(["require", "exports", 'durandal/app'], function(require, exports, __durandal__) {
    var durandal = __durandal__;

    function getViewModel() {
        return new Shell(durandal);
    }
    exports.getViewModel = getViewModel;
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
    exports.Shell = Shell;    
})
//@ sourceMappingURL=shell.js.map
