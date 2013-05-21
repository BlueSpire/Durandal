define(['../durandal/system', '../durandal/app', '../durandal/viewModel', './history'],
    function (system, app, viewModel, history) {
        
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    var queue = [],
        isNavigating = ko.observable(false),
        currentActivation,
        currentInstruction,
        activeItem = viewModel.activator();
        
    var router = {
        routes: {},
        activeItem: activeItem,
        isNavigating: isNavigating
    };

    function routeStringToRegExp(routeString) {
        routeString = routeString.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
                return optional ? match : '([^\/]+)';
            })
            .replace(splatParam, '(.*?)');

        return new RegExp('^' + routeString + '$');
    }

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    function extractParameters(route, fragment) {
        var params = route.exec(fragment).slice(1);

        for (var i = 0; i < params.length; i++) {
            var current = params[i];
            params[i] = current ? decodeURIComponent(current) : null;
        }

        return params;
    }

    function completeNavigation(instance, instruction) {
        system.log('Navigation Complete', instance, instruction);

        currentActivation = instance;
        currentInstruction = instruction;
        
        router.updateDocumentTitle(instance, instruction);
        
        app.trigger('router:navigation-complete', instance, instruction);
    }
        
    function cancelNavigation(instance, instruction) {
        system.log('Navigation Cancelled');

        if (currentInstruction) {
            router.navigate(currentInstruction.fragment, { replace: true });
        }

        isNavigating(false);
        
        app.trigger('router:navigation-cancelled', instance, instruction);
    }
        
    function redirect(url) {
        system.log('Navigation Redirecting');

        isNavigating(false);
        router.navigate(url, { trigger: true, replace: true });
    }
    
    function activateRoute(instance, instruction) {
        activeItem.activateItem(instance, instruction.params).then(function (succeeded) {
            if (succeeded) {
                completeNavigation(instance, instruction);
            } else {
                cancelNavigation(instance, instruction);
            }
        });
    }
    
    function handleGuardedRoute(instance, instruction) {
        var resultOrPromise = router.guardRoute(instance, instruction);
        if (resultOrPromise) {
            if (resultOrPromise.then) {
                resultOrPromise.then(function (result) {
                    if (result) {
                        if (system.isString(result)) {
                            redirect(result);
                        } else {
                            activateRoute(instance, instruction);
                        }
                    } else {
                        cancelNavigation(instance, instruction);
                    }
                });
            } else {
                if (system.isString(resultOrPromise)) {
                    redirect(resultOrPromise);
                } else {
                    activateRoute(instance, instruction);
                }
            }
        } else {
            cancelNavigation(instance, instruction);
        }
    }
    
    function dequeueRoute() {
        if (isNavigating()) {
            return;
        }

        var instruction = queue.shift();
        queue = [];

        if (!instruction) {
            return;
        }

        isNavigating(true);

        system.acquire(instruction.options.moduleId).then(function(module) {
            var instance = router.getActivatableInstance(module, instruction);

            if (router.guardRoute) {
                handleGuardedRoute(instance, instruction);
            } else {
                activateRoute(instance, instruction);
            }
        });
    }
        
    function queueRoute(instruction) {
        queue.unshift(instruction);
        dequeueRoute();
    }
        
    function mapRoute(options) {
        //title, isActive, hash, caption?, settings?

        if (!system.isRegExp(options.route)) {
            options.route = routeStringToRegExp(options.route);
        }

        history.route(options.route, function (fragment) {
            queueRoute({
                fragment: fragment,
                options: options,
                params: extractParameters(options.route, fragment)
            });
        });

        return router;
    }
        
    router.updateDocumentTitle = function (instance, instruction) {
        if (instruction.options.title) {
            if (app.title) {
                document.title = instruction.options.title + " | " + app.title;
            } else {
                document.title = instruction.options.title;
            }
        } else if (app.title) {
            document.title = app.title;
        }
    };

    router.getActivatableInstance = function (module, instruction) {
        if (system.isFunction(module)) {
            return new module();
        } else {
            return module;
        }
    };

    router.convertRouteToModuleId = function (route) {
        var colonIndex = route.indexOf(':');
        var length = colonIndex > 0 ? colonIndex - 1 : route.length;
        return route.substring(0, length);
    };

    // Manually bind a single named route to a module. For example:
    //
    //     router.map('search/:query/p:num', 'viewmodels/search');
    //
    router.map = function (route, options) {
        if (system.isArray(route)) {
            for (var i = 0; i < route.length; i++) {
                router.map(route[i]);
            }

            return router;
        }

        if (system.isString(route) || system.isRegExp(route)) {
            if (!options) {
                options = {
                    moduleId: router.convertRouteToModuleId(route)
                };
            } else if (system.isString(options)) {
                options = {
                    moduleId: options
                };
            }

            options.route = route;
        } else {
            options = route;

            if (!options.moduleId) {
                options.moduleId = router.convertRouteToModuleId(options.route);
            }
        }

        return mapRoute(options);
    };
    
    // Simple proxy to `history` to save a fragment into the history.
    router.navigate = function (fragment, options) {
        history.navigate(fragment, options);
        return router;
    };

    router.afterCompose = function() {
        setTimeout(function() {
            isNavigating(false);
            app.trigger('router:navigation-composed', currentActivation, currentInstruction);
            dequeueRoute();
        }, 10);
    };

    router.configure = function (options) {
        router.options = options || {};
        router.routes = system.extend({}, router.routes, router.options.routes);

        var route, routes = system.keys(router.routes);

        // Bind all defined routes to history. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.

        while ((route = routes.pop()) != null) {
            router.map(route, router.routes[route]);
        }
        
        return router;
    };

    router.start = function () {
        //TODO: order visible routes???
        history.start(router.options);
        return router;
    };

    router.stop = function () {
        history.stop();
        return router;
    };
    
    router.reset = function () {
        
    };

    return router;
});