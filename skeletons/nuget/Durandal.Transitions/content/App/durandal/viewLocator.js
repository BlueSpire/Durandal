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
        useConvention: function (modulesPath, viewsPath, partialsPath) {
            modulesPath = modulesPath || 'viewmodels';
            viewsPath = viewsPath || 'views';
            partialsPath = partialsPath || viewsPath;
            
            var reg = new RegExp(escape(modulesPath), 'gi');
            
            this.convertModuleIdToViewUrl = function(moduleId) {
                return moduleId.replace(reg, viewsPath);
            };

            this.convertViewUrlToAreaUrl = function(area, viewUrl) {
                return partialsPath + '/' + viewUrl;
            };
        },
        locateViewForObject: function (obj, elementsToSearch) {
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
        convertViewUrlToAreaUrl: function(area, viewUrl) {
            return viewUrl;
        },
        locateView: function(viewOrUrl, area, elementsToSearch) {
            var that = this;
            return system.defer(function(dfd) {
                if (typeof viewOrUrl === 'string') {
                    if (viewOrUrl.indexOf(viewEngine.viewExtension) != -1) {
                        viewOrUrl = viewOrUrl.substring(0, viewOrUrl.length - viewEngine.viewExtension.length);
                    }

                    if (area) {
                        viewOrUrl = that.convertViewUrlToAreaUrl(area, viewOrUrl);
                    }

                    if (elementsToSearch) {
                        var existing = findInElements(elementsToSearch, viewOrUrl);
                        if (existing) {
                            dfd.resolve(existing);
                            return;
                        }
                    }

                    var requirePath = viewEngine.pluginPath + '!' + viewOrUrl + viewEngine.viewExtension;

                    system.acquire(requirePath).then(function (result) {
                        dfd.resolve(viewEngine.createView(viewOrUrl, result));
                    });
                } else {
                    dfd.resolve(viewOrUrl);
                }
            }).promise();
        }
    };
});