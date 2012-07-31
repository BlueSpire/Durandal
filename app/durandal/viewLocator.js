define(function(require) {
    var system = require('durandal/system'),
        viewEngine = require('durandal/viewEngine');

    function getTypeName(object) {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((object).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }

    return {
        locateViewForModel: function(model) {
            var view;

            if (model.getView) {
                view = model.getView();
                if (view) {
                    return this.locateView(view);
                }
            }

            if (model.viewUrl) {
                return this.locateView(model.viewUrl);
            }

            if (model.__moduleId__) {
                return this.locateView(model.__moduleId__);
            }

            var viewUrl = 'views/' + getTypeName(model);
            return this.locateView(viewUrl);
        },
        locateView: function(view) {
            return system.defer(function(dfd) {
                if (typeof view === 'string') {
                    if (view.indexOf(viewEngine.viewExtension) != -1) {
                        view = view.substring(0, view.length - viewEngine.viewExtension.length);
                    }

                    var requireExpression = viewEngine.pluginPath + '!' + view + viewEngine.viewExtension;

                    system.acquire(requireExpression).then(function(result) {
                        dfd.resolve(viewEngine.createView(view, result));
                    });
                } else {
                    dfd.resolve(view);
                }
            }).promise();
        }
    };
});