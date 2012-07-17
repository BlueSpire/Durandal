define(function(require) {
    var first = require('samples/navigation/first'),
        second = require('samples/navigation/second');

    return {
        displayName: "Navigation",
        activeItem: ko.observable(first),
        gotoFirst: function() {
            this.activeItem(first);
        },
        gotoSecond: function() {
            this.activeItem(second);
        }
    };
});