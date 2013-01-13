define(function (require) {
    var system = require('durandal/system'),
        viewModel = require('durandal/viewModel');

    var routesByPath = {},
        allRoutes = ko.observableArray([]),
        visibleRoutes = ko.observableArray([]),
        ready = ko.observable(false),
        isNavigating = ko.observable(false),
        sammy,
        router,
        previousRoute,
        cancelling = false,
        activeItem = viewModel.activator(),
        navigationDefaultRoute;

    //NOTE: Sammy.js is not required by the core of Durandal. 
    //However, this plugin leverages it to enable navigation.

    function activateRoute(routeInfo, params, module) {
        system.log('Activating Route', routeInfo, params, module);

        activeItem.activateItem(module, params).then(function (succeeded) {
            if (succeeded) {
                document.title = routeInfo.name;
                previousRoute = sammy.last_location[1].replace('/', '');
            } else {
                cancelling = true;
                system.log('Cancelling Navigation');
                sammy.setLocation(previousRoute);
                cancelling = false;
                isNavigating(false);
            }
        });
    }

    function ensureRoute(route, params) {
        var routeInfo = routesByPath[route];

        if (!routeInfo) {
            if (!router.convertRouteToModuleId) {
                isNavigating(false);
                system.log('No Route Found', route, params);
                return;
            }

            routeInfo = {
                moduleId: router.convertRouteToModuleId(route),
                name: router.convertRouteToName(route)
            };
        }

        system.acquire(routeInfo.moduleId).then(function (module) {
            if (typeof module == 'function') {
                activateRoute(routeInfo, params, new module());
            } else {
                activateRoute(routeInfo, params, module);
            }
        });
    }

    function handleRoute() {
        if (cancelling) {
            return;
        }

        isNavigating(true);

        var route = this.app.last_route.path.toString();
        var params = this.params;

        if (route == '/$/') {
            if (router.convertRouteToModuleId) {
                var fragment = this.path.split('#/');
                if (fragment.length == 2) {
                    var parts = fragment[1].split('/');
                    route = parts[0];
                    params = parts.splice(1);
                } else {
                    route = navigationDefaultRoute;
                }
            } else {
                route = navigationDefaultRoute;
            }
        }

        ensureRoute(route, params);
    }

    function configureRoute(routeInfo) {
        routeInfo.name = routeInfo.name || router.convertRouteToName(routeInfo.url);
        routeInfo.hash = routeInfo.hash || '#/' + routeInfo.url;

        routesByPath[routeInfo.url] = routeInfo;
        allRoutes.push(routeInfo);

        if (routeInfo.visible) {
            routeInfo.isActive = ko.computed(function () {
                return ready() && activeItem() && activeItem().__moduleId__ == routeInfo.moduleId;
            });

            visibleRoutes.push(routeInfo);
        }

        return routeInfo;
    }

    return router = {
        ready: ready,
        allRoutes: allRoutes,
        visibleRoutes: visibleRoutes,
        isNavigating: isNavigating,
        activeItem: activeItem,
        afterCompose: function () {
            isNavigating(false);
        },
        navigateBack: function () {
            window.history.back();
        },
        navigateTo: function (url) {
            sammy.setLocation(url);
        },
        convertRouteToName: function (route) {
            return route.substring(0, 1).toUpperCase() + route.substring(1);
        },
        mapAuto: function (path) {
            path = path || 'viewmodels';

            this.convertRouteToModuleId = function (url) {
                return path + '/' + url;
            };
        },
        mapNav: function (url, moduleId, name) {
            return this.mapRoute(url, moduleId, name, true);
        },
        mapRoute: function (url, moduleId, name, visible) {
            var routeInfo = {
                url: url,
                moduleId: moduleId,
                name: name,
                visible: visible
            };

            return configureRoute(routeInfo);
        },
        map: function (routeOrRouteArray) {
            if (!system.isArray(routeOrRouteArray)) {
                configureRoute(routeOrRouteArray);
                return;
            }

            for (var i = 0; i < routeOrRouteArray.length; i++) {
                configureRoute(routeOrRouteArray[i]);
            }
        },
        enable: function (defaultRoute) {
            navigationDefaultRoute = defaultRoute;

            sammy = Sammy(function (route) {
                var unwrapped = allRoutes();
                for (var i = 0; i < unwrapped.length; i++) {
                    var current = unwrapped[i];

                    if (!(current.url instanceof RegExp)) {
                        route.get(current.url, handleRoute);
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

            sammy.log = function () {
                var args = Array.prototype.slice.call(arguments, 0);
                args.unshift('Sammy');
                system.log.apply(system, args);
            };

            sammy.run();
            ready(true);
            system.log("Router enabled.");
        }
    };
});