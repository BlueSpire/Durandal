define(function(require) {
    var system = require('./system'),
        viewEngine = require('./viewEngine');

    function findInElements(nodes, url) {
        for (var i = 0; i < nodes.length; i++) {
            var current = nodes[i];
            var existingUrl = current.getAttribute('data-view');
            if (existingUrl == url) {
                return current;
            }
        }
    }
    
    function escape(str) {
        return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
    }

    return {
        useConvention: function(modulesPath, viewsPath, partialsPath) {
            modulesPath = modulesPath || 'viewmodels';
            viewsPath = viewsPath || 'views';
            partialsPath = partialsPath || viewsPath;

            var reg = new RegExp(escape(modulesPath), 'gi');

            this.convertModuleIdToViewUrl = function(moduleId) {
                return moduleId.replace(reg, viewsPath);
            };

            this.translateViewIdToArea = function (viewId, area) {
                return partialsPath + '/' + viewId;
            };
        },
        locateViewForObject: function(obj, elementsToSearch) {
            var view;

            if (obj.getView) {
                view = obj.getView();
                if (view) {
                    return this.locateView(view, null, elementsToSearch);
                }
            }

            if (obj.viewUrl) {
                return this.locateView(obj.viewUrl, null, elementsToSearch);
            }

            var id = system.getModuleId(obj);
            if (id) {
                return this.locateView(this.convertModuleIdToViewUrl(id), null, elementsToSearch);
            }

            return this.locateView(this.determineFallbackViewUrl(obj), null, elementsToSearch);
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
        translateViewIdToArea: function (viewId, area) {
            return viewId;
        },
        locateView: function(viewOrUrl, area, elementsToSearch) {
            if (typeof viewOrUrl === 'string') {
                var viewId;

                if (viewEngine.isViewUrl(viewOrUrl)) {
                    viewId = viewEngine.convertViewUrlToViewId(viewOrUrl);
                } else {
                    viewId = viewOrUrl;
                }

                if (area) {
                    viewId = this.translateViewIdToArea(viewId, area);
                }

                if (elementsToSearch) {
                    var existing = findInElements(elementsToSearch, viewId);
                    if (existing) {
                        return system.defer(function(dfd) {
                            dfd.resolve(existing);
                        }).promise();
                    }
                }

                return viewEngine.createView(viewId);
            }

            return system.defer(function(dfd) {
                dfd.resolve(viewOrUrl);
            }).promise();
        }
    };
});