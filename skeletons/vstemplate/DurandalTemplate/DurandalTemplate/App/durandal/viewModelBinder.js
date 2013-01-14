define(function(require) {
    var system = require('./system');

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
            system.log('Binding', viewName, obj);
            action();
        } catch (e) {
            system.log(e.message, viewName, obj);
        }
    }

    return {
        bindContext: function(bindingContext, view, obj) {
            if (obj) {
                var childContext = bindingContext.createChildContext(obj);
                doBind(childContext, view, function() {
                    ko.applyBindingsToNode(view, null, childContext);
                });
            } else {
                doBind(bindingContext, view, function () {
                    ko.applyBindings(bindingContext, view);
                });
            }
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