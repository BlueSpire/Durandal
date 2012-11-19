define(function(require) {
    var system = require('durandal/system');

    return {
        bind: function (obj, view) {
            var viewName = view.getAttribute('data-view');

            try {
                system.log("Binding", viewName, obj);

                ko.applyBindings(obj, view);

                if (obj.setView) {
                    obj.setView(view);
                }
            } catch(e) {
                system.log(e.message, viewName, obj);
            }
        }
    };
});