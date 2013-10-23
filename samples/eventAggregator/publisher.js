define(['durandal/app', 'knockout'], function (app, ko) {
    var message = ko.observable();
    var canPublish = ko.computed(function () {
        return message() ? true : false;
    });

    return {
        message: message,
        canPublish:canPublish,
        publish: function () {
            app.trigger('sample:event', message());
        }
    };
});