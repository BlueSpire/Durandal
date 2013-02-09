﻿define(function(require) {
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
        activeRoute = ko.observable(),
        navigationDefaultRoute;

    //NOTE: Sammy.js is not required by the core of Durandal. 
    //However, this plugin leverages it to enable navigation.

    activeItem.settings.areSameItem = function(currentItem, newItem, activationData) {
        return false;
    };

    function activateRoute(routeInfo, params, module) {
        params.routeInfo = routeInfo;
        params.router = router;

        system.log('Activating Route', routeInfo, module, params);

        activeItem.activateItem(module, params).then(function(succeeded) {
            if (succeeded) {
                activeRoute(routeInfo);
                router.onNavigationComplete(routeInfo, params, module);
                previousModule = module;
                previousRoute = sammy.last_location[1].replace('/', '');
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
    
    function shouldStopNavigation() {
        return cancelling || (sammy.last_location[1].replace('/', '') == previousRoute);
    }

    function ensureRoute(route, params) {
        var routeInfo = routesByPath[route];
        
        if (shouldStopNavigation()) {
            return;
        }

        if (!routeInfo) {
            if (!router.autoConvertRouteToModuleId) {
                router.handleInvalidRoute(route, params);
                return;
            }

            routeInfo = {
                moduleId: router.autoConvertRouteToModuleId(route, params),
                name: router.convertRouteToName(route)
            };
        }
        
        isNavigating(true);

        system.acquire(routeInfo.moduleId).then(function(module) {
            if (typeof module == 'function') {
                activateRoute(routeInfo, params, new module());
            } else {
                activateRoute(routeInfo, params, module);
            }
        });
    }

    function handleDefaultRoute() {
        ensureRoute(navigationDefaultRoute, this.params || {});
    }
    
    function handleMappedRoute() {
        ensureRoute(this.app.last_route.path.toString(), this.params || {});
    }

    function handleWildCardRoute() {
        var params = this.params || {}, route;

        if (router.autoConvertRouteToModuleId) {
            var fragment = this.path.split('#/');

            if (fragment.length == 2) {
                var parts = fragment[1].split('/');
                route = parts[0];
                params.splat = parts.splice(1);
                ensureRoute(route, params);
                return;
            }
        }

        router.handleInvalidRoute(this.app.last_location[1], params);
    }

    function configureRoute(routeInfo) {
        router.prepareRouteInfo(routeInfo);

        routesByPath[routeInfo.url] = routeInfo;
        allRoutes.push(routeInfo);

        if (routeInfo.visible) {
            routeInfo.isActive = ko.computed(function() {
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
        activeRoute: activeRoute,
        afterCompose: function() {
            isNavigating(false);
        },
        useConvention: function (rootPath) {
            rootPath = rootPath == null ? 'viewmodels' : rootPath;
            if (rootPath) {
                rootPath += '/';
            }
            router.convertRouteToModuleId = function(url) {
                return rootPath + router.stripParameter(url);
            };
        },
        stripParameter: function(val) {
            var colonIndex = val.indexOf(':');
            var length = colonIndex > 0 ? colonIndex - 1 : val.length;
            return val.substring(0, length);
        },
        handleInvalidRoute: function(route, params) {
            system.log('No Route Found', route, params);
        },
        onNavigationComplete: function (routeInfo, params, module) {
            document.title = routeInfo.name;
        },
        navigateBack: function() {
            window.history.back();
        },
        navigateTo: function(url) {
            sammy.setLocation(url);
        },
        replaceLocation: function(url) {
            window.location.replace(url);
        },
        convertRouteToName: function(route) {
            var value = router.stripParameter(route);
            return value.substring(0, 1).toUpperCase() + value.substring(1);
        },
        convertRouteToModuleId: function(route) {
            return router.stripParameter(route);
        },
        prepareRouteInfo: function(info) {
            if (!(info.url instanceof RegExp)) {
                info.name = info.name || router.convertRouteToName(info.url);
                info.moduleId = info.moduleId || router.convertRouteToModuleId(info.url);
                info.hash = info.hash || '#/' + info.url;
            }

            info.caption = info.caption || info.name;
            info.settings = info.settings || {};
        },
        mapAuto: function(path) {
            path = path || 'viewmodels';
            path += '/';

            router.autoConvertRouteToModuleId = function(url, params) {
                return path + router.stripParameter(url);
            };
        },
        mapNav: function (urlOrConfig, moduleId, name) {
            if (typeof urlOrConfig == "string") {
                return this.mapRoute(urlOrConfig, moduleId, name, true);
            }

            urlOrConfig.visible = true;
            return configureRoute(urlOrConfig);
        },
        mapRoute: function(urlOrConfig, moduleId, name, visible) {
            if (typeof urlOrConfig == "string") {
                return configureRoute({
                    url: urlOrConfig,
                    moduleId: moduleId,
                    name: name,
                    visible: visible
                });
            } else {
                return configureRoute(urlOrConfig);
            }
        },
        map: function(routeOrRouteArray) {
            if (!system.isArray(routeOrRouteArray)) {
                return configureRoute(routeOrRouteArray);
            }

            var configured = [];
            for (var i = 0; i < routeOrRouteArray.length; i++) {
                configured.push(configureRoute(routeOrRouteArray[i]));
            }
            return configured;
        },
        activate: function(defaultRoute) {
            return system.defer(function(dfd) {
                var processedRoute;
                
                router.dfd = dfd;
                navigationDefaultRoute = defaultRoute;

                sammy = Sammy(function(route) {
                    var unwrapped = allRoutes();
                    
                    for (var i = 0; i < unwrapped.length; i++) {
                        var current = unwrapped[i];
                        route.get(current.url, handleMappedRoute);
                        processedRoute = this.routes.get[i];
                        routesByPath[processedRoute.path.toString()] = current;
                    }

                    route.get(/\#\/(.*)/, handleWildCardRoute);
                    route.get('', handleDefaultRoute);
                });

                sammy._checkFormSubmission = function() {
                    return false;
                };

                sammy.log = function() {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args.unshift('Sammy');
                    system.log.apply(system, args);
                };

                sammy.run();
            }).promise();
        }
    };
});