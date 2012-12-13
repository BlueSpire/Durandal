/// <reference path="..\..\dts\knockout-2.2.d.ts" />

import durandalApp = module('durandal/app');

var app1: any;
app1 = durandalApp;
var app: durandalApp.DurandallApp;
app = app1;    

export class Project
{ 
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    };
    
    canActivate() {
        return app.showMessage("Do you want to view " + this.name + "?", "Master Detail", ['Yes', 'No']);
    };

    activate() {
    };

    canDeactivate () {
        return app.showMessage("Do you want to leave " + this.name + "?", "Master Detail", ['Yes', 'No']);
    };

    deactivate () {
    };

}