define(function (require) {
    var system = require('durandal/system');
    var routesByPath = {}, routes = [], autoNavPath, sammy;
    
    //NOTE: Sammy.js is not required by the core of Durandal. 
    //However, this plugin leverages it to enable navigation.

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
            autoNavPath = path || 'viewmodels';
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

            routesByPath[url] = routeInfo;
            routes.push(routeInfo);

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

            function activateRoute(route, params) {
                var routeInfo = routesByPath[route];

                if (!routeInfo) {
                    if (!autoNavPath) {
                        return;
                    }

                    routeInfo = {
                        moduleId: autoNavPath + "/" + route,
                        name: route.substring(0, 1).toUpperCase() + route.substring(1)
                    };
                }

                system.acquire(routeInfo.moduleId).then(function (module) {
                    if (typeof module == "function") {
                        trySwap(new module(params), routeInfo.name);
                    } else {
                        trySwap(module, routeInfo.name);
                    }
                });
            }

            function handleRoute() {
                if (cancelling) {
                    return;
                }

                var route = this.app.last_route.path.toString();
                var params = this.params;

                if (route == '/$/') {
                    if (autoNavPath) {
                        var fragment = this.path.split('#/');
                        if (fragment.length == 2) {
                            var parts = fragment[1].split('/');
                            route = parts[0];
                            params = parts.splice(1);
                        } else {
                            route = defaultRoute;
                        }
                    } else {
                        route = defaultRoute;
                    }
                }

                activateRoute(route, params);
            }

            sammy = Sammy(function(route) {
                for (var i = 0; i < routes.length; i++) {
                    var current = routes[i];

                    if (!(current.url instanceof RegExp)) {
                        route.get('#/' + current.url, handleRoute);
                    } else {
                        route.get(current.url, handleRoute);
                    }

                    var processedRoute = this.routes.get[i];
                    routesByPath[processedRoute.path.toString()] = current;
                }

                route.get('', handleRoute);
            });

            sammy._checkFormSubmission = function () {
                return false;
            };

            this.navigationReady(true);

            sammy.run();
        }
    };
});