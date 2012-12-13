define(["require", "exports", 'samples/masterDetailTs/project', 'durandal/viewModel'], function(require, exports, __projectModule__, __viewModelModule__) {
    var projectModule = __projectModule__;

    var viewModelModule = __viewModelModule__;

    var viewModel1;
    viewModel1 = viewModelModule;
    var viewModel;
    viewModel = viewModel1;
    var Shell = (function () {
        function Shell() {
            this.projects = ko.observableArray([
                new projectModule.Project("Durandal", "A cross-device, cross-platform application framework written in JavaScript, Durandal is a very small amount of code built on top of three existing and established Javascript libraries: jQuery, Knockout and RequireJS."), 
                new projectModule.Project("UnityDatabinding", "A general databinding framework for Unity3D. Includes bindings for UI composition and samples for the NGUI library."), 
                new projectModule.Project("Caliburn.Micro", "Caliburn.Micro is a small, yet powerful framework, designed for building applications across all Xaml Platforms. With strong support for MVVM and other proven UI patterns, Caliburn.Micro will enable you to build your solution quickly, without the need to sacrifice code quality or testability.")
            ]);
        }
        Shell.prototype.activeProject = function () {
            return viewModel.activator.forItems(this.projects);
        };
        return Shell;
    })();
    exports.Shell = Shell;    
    ; ;
})
//@ sourceMappingURL=shell.js.map
