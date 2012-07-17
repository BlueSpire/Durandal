define(function(require) {
    var system = require('durandal/system');

    return {
        bind: function(model, view) {
            system.log("Binding", model, view);
            
            ko.applyBindings(model, view);
            if (model.setView) {
                model.setView(view);
            }
        }
    };
});