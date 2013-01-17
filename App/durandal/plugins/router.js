﻿define(function (require) {
    var system = require('../system'),
        viewModel = require('../viewModel');

    var routesByPath = {},
        allRoutes = ko.observableArray([]),
        visibleRoutes = ko.observableArray([]),
        ready = ko.observable(false),
        isNavigating = ko.observable(false),
        sammy,
        router,
        previousRoute,
        previousModule,
        cancelling = false,
        activeItem = viewModel.activator(),
        navigationDefaultRoute,
        automap = false;

    //NOTE: Sammy.js is not required by the core of Durandal. 
    //However, this plugin leverages it to enable navigation.

    function activateRoute(routeInfo, params, module, forceStopNavigation) {
        params.routeInfo = routeInfo;
        params.router = router;

        system.log('Activating Route', routeInfo, module, params);

        activeItem.activateItem(module, params).then(function (succeeded) {
            if (succeeded) {
                document.title = routeInfo.name;
                previousModule = module;
                previousRoute = sammy.last_location[1].replace('/', '');

                if (forceStopNavigation) {
                    isNavigating(false);
                }
            } else {
                cancelling = true;
                system.log('Cancelling Navigation');
                sammy.setLocation(previousRoute);
                cancelling = false;
                isNavigating(false);
            }

            if (router.dfd) {
                ready(true);
                router.dfd.resolve();

                delete router.dfd;
            }
        });
    }

    function ensureRoute(route, params) {
        var routeInfo = routesByPath[route];

        if (!routeInfo) {
            if (!automap) {
                isNavigating(false);
                router.handleInvalidRoute(route, params);
                return;
            }

            routeInfo = {
                moduleId: router.convertRouteToModuleId(route, params),
                name: router.convertRouteToName(route)
            };
        }

        system.acquire(routeInfo.moduleId).then(function (module) {
            if (typeof module == 'function') {
                activateRoute(routeInfo, params, new module());
            } else {
                activateRoute(routeInfo, params, module, previousModule == module);
            }
        });
    }

    function handleRoute() {
        if (cancelling) {
            return;
        }

        if (sammy.last_location[1].replace('/', '') == previousRoute) {
            return;
        }

        isNavigating(true);

        var route = this.app.last_route.path.toString();
        var params = this.params;

        if (route == '/$/') {
            if (automap) {
                var fragment = this.path.split('#/');
                if (fragment.length == 2) {
                    route = fragment[1];
                } else {
                    route = navigationDefaultRoute;
                }
            } else {
                if (this.app.last_location[1] != '/') {
                    router.handleInvalidRoute(this.app.last_location[1], params);
                    isNavigating(false);
                    return;
                }

                route = navigationDefaultRoute;
            }
        }

        ensureRoute(route, params);
    }

    function configureRoute(routeInfo) {
        router.prepareRouteInfo(routeInfo);

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

    function stripParameter(val) {
        var colonIndex = val.indexOf(':');
        var length = colonIndex > 0 ? colonIndex - 1 : val.length;
        return val.substring(0, length);
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
        handleInvalidRoute: function (route, params) {
            system.log('No Route Found', route, params);
        },
        navigateBack: function () {
            window.history.back();
        },
        navigateTo: function (url) {
            sammy.setLocation(url);
        },
        convertRouteToName: function (route) {
            var value = stripParameter(route);
            return value.substring(0, 1).toUpperCase() + value.substring(1);
        },
        convertRouteToModuleId: function (url) {
            return 'viewmodels/' + stripParameter(url);
        },
        prepareRouteInfo: function (info) {
            info.name = info.name || router.convertRouteToName(info.url);
            info.moduleId = info.moduleId || router.convertRouteToModuleId(info.url);
            info.caption = info.caption || info.name;
            info.hash = info.hash || '#/' + info.url;
            info.settings = info.settings || {};
        },
        mapAuto: function (path) {
            automap = true;

            path = path || 'viewmodels';
            path += '/';

            this.convertRouteToModuleId = function (url) {
                return path + url;
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
        activate: function (defaultRoute) {
            return system.defer(function (dfd) {
                router.dfd = dfd;
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
            }).promise();
        }
    };
});