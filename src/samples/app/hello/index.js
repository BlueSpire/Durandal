define(['durandal/app', 'knockout'], function (app, ko) {
    var name = ko.observable();
    var canSayHello = ko.computed(function () {
        return name() ? true : false;
    });

    return {
        displayName: 'What is your name?',
        name: name,
        sayHello: function() {
            app.showMessage('Hello ' + name() + '!', 'Greetings');
        },
        canSayHello: canSayHello,
        activate: function() {
            console.log('Hello : Lifecycle : activate');
        },
        beforeBind: function () {
            console.log('Hello : Lifecycle : beforeBind');
        },
        afterBind: function () {
            console.log('Hello : Lifecycle : afterBind');
        },
        viewAttached: function (view) {
            console.log('Hello : Lifecycle : viewAttached');
        },
        documentAttached: function (view) {
            console.log('Hello : Lifecycle : documentAttached');
        },
        documentDetached: function (view) {
            console.log('Hello : Lifecycle : documentDetached'); //Note: This won't be called as long as the composition system is set to cache views.
        }
    };
});