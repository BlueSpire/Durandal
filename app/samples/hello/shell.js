define(function (require) {
    var app = require('durandal/app');

    var name = ko.observable();

    var canSayHello = ko.computed(function () {
        return name() ? true : false;
    });

    return {
        displayName: "Hello",
        name: name,
        sayHello: function () {
            app.showMessage("Hello " + name(), "Greetings");
        },
        canSayHello: canSayHello
    };
});