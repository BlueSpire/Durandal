define(function(require) {
    var system = require('durandal/system');

    return {
        displayName: 'Second Page',
        items: ko.observableArray([]),
        deactivate: function() {
            system.log('Hello from second\'s deactivate function');
        },
        add: function() {
            this.items.push("Item");
        }
    };
});