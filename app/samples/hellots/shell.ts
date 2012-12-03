/// <reference path="..\..\dts\knockout-2.2.d.ts" />
/// <reference path="..\..\durandal\app.d.ts"/>


import durandal = module('durandal/app');

export function getViewModel() { 
    return new Shell(durandal);
}

export class Shell 
{
    displayName: KnockoutObservableString;
    name: KnockoutObservableString;
    canSayHello: KnockoutObservableBool;
    app: any;

    constructor (app) {
        this.app = app;
        this.name = ko.observable();
        this.displayName = ko.observable();
        this.canSayHello = ko.computed(()=> this.name() ? true : false);
    }

    public sayHello()
    { 
        this.app.showMessage("Hello " + this.name(), "Greetings");
    }
}

