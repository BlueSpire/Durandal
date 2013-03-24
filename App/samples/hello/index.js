define(['durandal/app'], function (app) {
    
    var name = ko.observable();
    var canSayHello = ko.computed(function () {
        return name() ? true : false;
    });

    return {
        displayName: 'What is your name?',
        name: name,
        sayHello: function () {
            app.showMessage('Hello ' + name() + '!', 'Greetings');
        },
        canSayHello: canSayHello
    };
});