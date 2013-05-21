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
        activeItem = viewModel.activator(),
        isConfigured = false;

    var router = {
        routes:[],
        activeItem: activeItem,
        isNavigating: isNavigating,
        events: app
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
        
        router.events.trigger('router:navigation-complete', instance, instruction);
    }
        
    function cancelNavigation(instance, instruction) {
        system.log('Navigation Cancelled');

        if (currentInstruction) {
            router.navigate(currentInstruction.fragment, { replace: true });
        }

        isNavigating(false);
        
        router.events.trigger('router:navigation-cancelled', instance, instruction);
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

        system.acquire(instruction.config.moduleId).then(function (module) {
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
        
    function mapRoute(config) {
        if (!system.isRegExp(config.route)) {
            config.title = info.title || router.convertRouteToTitle(config.route);
            config.moduleId = config.moduleId || router.convertRouteToModuleId(config.url);
            config.hash = config.hash || '#/' + config.route;
            config.route = routeStringToRegExp(config.route);
        }
        
        config.caption = config.caption || config.title;
        config.settings = config.settings || {};

        router.routes.push(config);

        history.route(config.route, function (fragment) {
            queueRoute({
                fragment: fragment,
                config: config,
                params: extractParameters(config.route, fragment)
            });
        });

        return router;
    }
        
    router.updateDocumentTitle = function (instance, instruction) {
        if (instruction.config.title) {
            if (app.title) {
                document.title = instruction.config.title + " | " + app.title;
            } else {
                document.title = instruction.config.title;
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

    router.stripParametersFromRoute = function(route) {
        var colonIndex = route.indexOf(':');
        var length = colonIndex > 0 ? colonIndex - 1 : route.length;
        return route.substring(0, length);
    };

    router.convertRouteToModuleId = function (route) {
        return router.stripParametersFromRoute(route);
    };
        
    router.convertRouteToTitle = function (route) {
        var value = router.stripParametersFromRoute(route);
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    };

    // Manually bind a single named route to a module. For example:
    //
    //     router.map('search/:query/p:num', 'viewmodels/search');
    //
    router.map = function (route, config) {
        if (system.isArray(route)) {
            // We have to reverse the
            // order of the routes here to support behavior where the most general
            // routes can be defined at the bottom of the route array.
            var current;
            
            while ((current = route.pop()) != null) {
                router.map(current);
            }

            return router;
        }

        if (system.isString(route) || system.isRegExp(route)) {
            if (!config) {
                config = {};
            } else if (system.isString(config)) {
                config = {
                    moduleId: config
                };
            }

            config.route = route;
        } else {
            config = route;
        }

        return mapRoute(config);
    };
    
    // Simple proxy to `history` to save a fragment into the history.
    router.navigate = function (fragment, options) {
        history.navigate(fragment, options);
        return router;
    };

    router.afterCompose = function() {
        setTimeout(function() {
            isNavigating(false);
            router.events.trigger('router:navigation-composed', currentActivation, currentInstruction);
            dequeueRoute();
        }, 10);
    };

    router.buildNavigation = function () {
        //if (config.nav) {
        //    config.isActive = ko.computed(function () {
        //        return activeItem() && activeItem().__moduleId__ == config.moduleId;
        //    });
        //}
    };

    router.configure = function(options) {
        if (isConfigured) {
            return router;
        }

        router.options = options || {};
        router.buildNavigation();
        isConfigured = true;

        return router;
    };

    router.start = function () {
        if (!isConfigured) {
            throw new Error('You must call "configure" before you can start the router.');
        }

        history.start(router.options);
        
        return router;
    };

    router.stop = function () {
        history.stop();
        return router;
    };
    
    router.reset = function () {
        isConfigured = false;

        history.handlers = [];
        router.routes = [];

        return router;
    };

    return router;
});