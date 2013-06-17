define(['durandal/app', 'durandal/system', 'knockout'], function (app, system, ko) {
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
            system.log('Lifecycle : activate');
        },
        beforeBind: function () {
            system.log('Lifecycle : beforeBind');
        },
        afterBind: function () {
            system.log('Lifecycle : afterBind');
        },
        attachedToParent: function (view, parent) {
            system.log('Lifecycle : attachedToParent');
        },
        compositionComplete: function (view) {
            system.log('Lifecycle : compositionComplete');
        },
        detachedFromDocument: function (view) {
            system.log('Lifecycle : detachedFromDocument'); //Note: This won't be called as long as the composition system is set to cache views.
        }
    };
});