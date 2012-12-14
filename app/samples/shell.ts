/// <reference path="..\..\dts\require-2.1.d.ts" />
/// <reference path="..\..\dts\knockout-2.2.d.ts" />

require(['durandal/app'], (app) =>
{ 
});

export class Shell {
        displayName: KnockoutObservableString;
        name: KnockoutObservableString;
        canSayHello: KnockoutObservableBool;
        app: any;

        constructor (app : any) {
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
//}
