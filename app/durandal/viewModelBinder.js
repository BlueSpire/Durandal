define(function(require) {
    var system = require('durandal/system');

    return {
        bind: function(obj, view) {
            system.log("Binding", obj, view);
            
            ko.applyBindings(obj, view);
            if (obj.setView) {
                obj.setView(view);
            }
        }
    };
});