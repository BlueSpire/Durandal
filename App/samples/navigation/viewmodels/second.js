define(function(require) {
    var system = require('durandal/system');

    return {
        displayName: 'Second Page',
        items: ko.observableArray([]),
        deactivate: function () {
            //called by the activator when leaving this screen
            system.log('Hello from second\'s deactivate function');
        },
        add: function() {
            this.items.push("Item");
        },
        viewAttached: function (view) {
            //called by the composition infrastructure after everything is bound
            system.log('View Attached', view);
        }
    };
});