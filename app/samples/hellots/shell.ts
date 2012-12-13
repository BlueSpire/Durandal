/// <reference path="..\..\dts\knockout-2.2.d.ts" />

import durandalApp = module('durandal/app');

// hack to get around
var app1: any;
app1 = durandalApp;
var app: durandalApp.DurandallApp;
app = app1;
     
export class Shell 
{
    displayName: KnockoutObservableString;
    name: KnockoutObservableString;
    canSayHello: KnockoutObservableBool;

    constructor () {
        this.name = ko.observable();
        this.displayName = ko.observable();
        this.canSayHello = ko.computed(()=> this.name() ? true : false);
    }

    public sayHello()
    { 
        app.showMessage("Hello " + this.name(), "Greetings");
    }
}

