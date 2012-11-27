define(function(require) {
    var system = require('durandal/system');

    function doBind(obj, view, action) {
        if (!view || !obj) {
            system.log('Insufficent Information to Bind', view, obj);
            return;
        }

        if (!view.getAttribute) {
            system.log('Unexpected View Type', view, obj);
            return;
        }

        var viewName = view.getAttribute('data-view');
        try {
            system.log("Binding", viewName, obj);
            action();
        } catch (e) {
            system.log(e.message, viewName, obj);
        }
    }

    return {
        bindContext: function(bindingContext, view) {
            doBind(bindingContext, view, function() {
                ko.applyBindingsToDescendants(bindingContext, view);
            });
        },
        bind: function(obj, view) {
            doBind(obj, view, function() {
                ko.applyBindings(obj, view);
                if (obj.setView) {
                    obj.setView(view);
                }
            });
        }
    };
});