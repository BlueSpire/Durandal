define(function (require) {
    var system = require('durandal/system');
    var routes = {}, autoNavPath, sammy;
    
    //NOTE: Sammy.js is not required by the core of Durandal. 
    //However, this plugin leverages it to enable navigation.

    function construct(ctor, args) {
        function F() {
            return ctor.apply(this, args);
        }
        F.prototype = ctor.prototype;
        return new F();
    }

    return {
        navigationReady:ko.observable(false),
        navigation: ko.observableArray([]),
        navigateBack:function () {
            window.history.back();
        },
        navigateTo:function (url) {
            sammy.setLocation(url);
        },
        mapAuto: function (path) {
            autoNavPath = path;
        },
        mapNav: function (url, moduleId, name) {
            this.mapRoute(url, moduleId, name, true);
        },
        mapRoute: function (url, moduleId, name, isNav) {
            var that = this;
            var routeInfo = {
                url: url,
                moduleId: moduleId,
                name: name || (url.substring(0, 1).toUpperCase() + url.substring(1))
            };

            routes[url] = routeInfo;

            if (isNav) {
                routeInfo.isActive = ko.computed(function() {
                    return that.navigationReady() && that.activator() && that.activator().__moduleId__ == routeInfo.moduleId;
                });

                this.navigation.push(routeInfo);
            }
        },
        enable: function (activator, defaultRoute) {
            var cancelling = false, previousRoute;
            
            this.activator = activator;

            function trySwap(item, title) {
                activator.activateItem(item).then(function (succeeded) {
                    if (succeeded) {
                        document.title = title;
                        previousRoute = sammy.last_location[1].replace('/', '');
                    } else {
                        cancelling = true;
                        sammy.setLocation(previousRoute);
                        cancelling = false;
                    }
                });
            }

            function activateRoute(route) {
                var parts = route.split('/');
                var lookup = parts[0];
                var params = parts.splice(1);
                var routeInfo = routes[lookup];

                if (!routeInfo) {
                    if (!autoNavPath) {
                        return;
                    }

                    routeInfo = {
                        moduleId: autoNavPath + "/" + lookup,
                        name: lookup.substring(0, 1).toUpperCase() + lookup.substring(1)
                    };
                }

                system.acquire(routeInfo.moduleId).then(function (module) {
                    if (typeof module == "function") {
                        if (params && params.length > 0) {
                            trySwap(construct(module, params), routeInfo.name);
                        } else {
                            trySwap(new module(), routeInfo.name);
                        }
                    } else {
                        trySwap(module, routeInfo.name);
                    }
                });
            }

            sammy = Sammy(function(route) {
                route.get('', function() {
                    if (cancelling) {
                        return;
                    }

                    var fragment = this.path.split('#/');
                    if (fragment.length == 2) {
                        activateRoute(fragment[1]);
                    } else {
                        activateRoute(defaultRoute);
                    }
                });
            });

            sammy._checkFormSubmission = function () {
                return false;
            };

            this.navigationReady(true);

            sammy.run();
        }
    };
});