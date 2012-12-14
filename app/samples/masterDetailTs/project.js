define(["require", "exports", 'durandal/app'], function(require, exports, __durandalApp__) {
    var durandalApp = __durandalApp__;

    var app1;
    app1 = durandalApp;
    var app;
    app = app1;
    var Project = (function () {
        function Project(name, description) {
            this.name = name;
            this.description = description;
        }
        Project.prototype.canActivate = function () {
            return app.showMessage("Do you want to view " + this.name + "?", "Master Detail", [
                'Yes', 
                'No'
            ]);
        };
        Project.prototype.activate = function () {
        };
        Project.prototype.canDeactivate = function () {
            return app.showMessage("Do you want to leave " + this.name + "?", "Master Detail", [
                'Yes', 
                'No'
            ]);
        };
        Project.prototype.deactivate = function () {
        };
        return Project;
    })();
    exports.Project = Project;    
})
//@ sourceMappingURL=project.js.map
