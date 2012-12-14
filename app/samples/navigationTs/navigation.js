define(["require", "exports", 'durandal/viewModel'], function(require, exports, __viewModelModule__) {
    var viewModelModule = __viewModelModule__;

    var viewModel1;
    viewModel1 = viewModelModule;
    var viewModel;
    viewModel = viewModel1;
    var First = (function () {
        function First() {
            this.displayName = 'First Page';
        }
        First.prototype.activate = function () {
        };
        return First;
    })();
    exports.First = First;    
    var Second = (function () {
        function Second() {
            this.displayName = 'Second Page';
        }
        Second.prototype.activate = function () {
        };
        return Second;
    })();
    exports.Second = Second;    
    var Shell = (function () {
        function Shell() {
            this.displayName = "Navigation";
            this.activeItem = viewModel.activator(new First());
        }
        Shell.prototype.gotoFirst = function () {
            this.activeItem(new First());
        };
        Shell.prototype.gotoSecond = function () {
            this.activeItem(new Second());
        };
        return Shell;
    })();
    exports.Shell = Shell;    
})
//@ sourceMappingURL=navigation.js.map
