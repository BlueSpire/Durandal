define(function(require) {
    var system = require('durandal/system'),
        viewEngine = require('durandal/viewEngine');

    return {
        locateViewForObject: function(obj) {
            var view;

            if (obj.getView) {
                view = obj.getView();
                if (view) {
                    return this.locateView(view);
                }
            }

            if (obj.viewUrl) {
                return this.locateView(obj.viewUrl);
            }

            var id = system.getModuleId(obj);
            if (id) {
                return this.locateView(this.convertModuleIdToViewUrl(id));
            }

            return this.locateView(this.determineFallbackViewUrl(obj));
        },
        convertModuleIdToViewUrl: function(moduleId) {
            return moduleId;
        },
        determineFallbackViewUrl: function(obj) {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((obj).constructor.toString());
            var typeName = (results && results.length > 1) ? results[1] : "";

            return 'views/' + typeName;
        },
        locateView: function(viewOrUrl) {
            return system.defer(function(dfd) {
                if (typeof viewOrUrl === 'string') {
                    if (viewOrUrl.indexOf(viewEngine.viewExtension) != -1) {
                        viewOrUrl = viewOrUrl.substring(0, viewOrUrl.length - viewEngine.viewExtension.length);
                    }

                    var requireExpression = viewEngine.pluginPath + '!' + viewOrUrl + viewEngine.viewExtension;

                    system.acquire(requireExpression).then(function(result) {
                        dfd.resolve(viewEngine.createView(viewOrUrl, result));
                    });
                } else {
                    dfd.resolve(viewOrUrl);
                }
            }).promise();
        }
    };
});