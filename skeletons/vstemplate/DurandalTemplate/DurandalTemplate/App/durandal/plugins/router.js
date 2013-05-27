define(['../system', '../app', '../viewModel', '../events', './history'],
function(system, app, viewModel, events, history) {

    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    var startDeferred, rootRouter;

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

    function stripParametersFromRoute(route) {
        var colonIndex = route.indexOf(':');
        var length = colonIndex > 0 ? colonIndex - 1 : route.length;
        return route.substring(0, length);
    }

    function hasChildRouter(instance) {
        return instance.router && instance.router.loadUrl;
    }

    var createRouter = function() {
        var queue = [],
            isProcessing = ko.observable(false),
            currentActivation,
            currentInstruction,
            activeItem = viewModel.activator();

        var router = {
            handlers: [],
            routes: [],
            navigationModel: ko.observableArray([]),
            activeItem: activeItem,
            isNavigating: ko.computed(function() {
                var current = activeItem();
                return isProcessing() || (current && current.router && current.router.isNavigating());
            })
        };

        events.includeIn(router);

        function completeNavigation(instance, instruction) {
            system.log('Navigation Complete', instance, instruction);

            currentActivation = instance;
            currentInstruction = instruction;

            if (!hasChildRouter(instance)) {
                router.updateDocumentTitle(instance, instruction);
            }

            router.trigger('router:navigation:complete', instance, instruction, router);
        }

        function cancelNavigation(instance, instruction) {
            system.log('Navigation Cancelled');

            if (currentInstruction) {
                router.navigate(currentInstruction.fragment, { replace: true });
            }

            isProcessing(false);
            router.trigger('router:navigation:cancelled', instance, instruction, router);
        }

        function redirect(url) {
            system.log('Navigation Redirecting');

            isProcessing(false);
            router.navigate(url, { trigger: true, replace: true });
        }

        function activateRoute(activator, instance, instruction) {
            activator.activateItem(instance, instruction.params).then(function(succeeded) {
                if (succeeded) {
                    var previousActivation = currentActivation;
                    completeNavigation(instance, instruction);

                    if (hasChildRouter(instance)) {
                        queueInstruction({
                            router: instance.router,
                            fragment: instruction.fragment
                        });
                    }

                    if (previousActivation == instance) {
                        router.afterCompose();
                    }
                } else {
                    cancelNavigation(instance, instruction);
                }

                if (startDeferred) {
                    startDeferred.resolve();
                    startDeferred = null;
                }
            });
        }

        function handleGuardedRoute(activator, instance, instruction) {
            var resultOrPromise = router.guardRoute(instance, instruction);
            if (resultOrPromise) {
                if (resultOrPromise.then) {
                    resultOrPromise.then(function(result) {
                        if (result) {
                            if (system.isString(result)) {
                                redirect(result);
                            } else {
                                activateRoute(activator, instance, instruction);
                            }
                        } else {
                            cancelNavigation(instance, instruction);
                        }
                    });
                } else {
                    if (system.isString(resultOrPromise)) {
                        redirect(resultOrPromise);
                    } else {
                        activateRoute(activator, instance, instruction);
                    }
                }
            } else {
                cancelNavigation(instance, instruction);
            }
        }

        function ensureActivation(activator, instance, instruction) {
            if (router.guardRoute) {
                handleGuardedRoute(activator, instance, instruction);
            } else {
                activateRoute(activator, instance, instruction);
            }
        }

        function canReuseCurrentActivation(instruction) {
            return currentInstruction
                && currentInstruction.config.moduleId == instruction.config.moduleId
                && currentActivation
                && ((currentActivation.canReuseForRoute && currentActivation.canReuseForRoute.apply(currentActivation, instruction.params))
                    || (currentActivation.router && currentActivation.router.loadUrl));
        }

        function dequeueInstruction() {
            if (isProcessing()) {
                return;
            }

            var instruction = queue.shift();
            queue = [];

            if (!instruction) {
                return;
            }

            if (instruction.router) {
                instruction.router.loadUrl(instruction.fragment);
                return;
            }

            isProcessing(true);

            if (canReuseCurrentActivation(instruction)) {
                ensureActivation(viewModel.activator(), currentActivation, instruction);
            } else {
                system.acquire(instruction.config.moduleId).then(function(module) {
                    var instance = new (system.getObjectResolver(module))();
                    ensureActivation(activeItem, instance, instruction);
                });
            }
        }

        function queueInstruction(instruction) {
            queue.unshift(instruction);
            dequeueInstruction();
        }

        function mapRoute(config) {
            if (!system.isRegExp(config.route)) {
                config.title = config.title || router.convertRouteToTitle(config.route);
                config.moduleId = config.moduleId || router.convertRouteToModuleId(config.route);
                config.hash = config.hash || router.convertRouteToHash(config.route);
                config.route = routeStringToRegExp(config.route);
            }

            router.trigger('router:route:mapping', config, router);
            router.routes.push(config);

            router.route(config.route, function(fragment) {
                queueInstruction({
                    fragment: fragment,
                    config: config,
                    params: extractParameters(config.route, fragment)
                });
            });

            return router;
        }

        function addActiveFlag(config) {
            config.isActive = ko.computed(function() {
                return activeItem() && activeItem().__moduleId__ == config.moduleId;
            });
        }

        // Add a route to be tested when the fragment changes. Routes added later
        // may override previous routes.
        router.route = function(route, callback) {
            router.handlers.push({ route: route, callback: callback });
        };

        // Attempt to load the current URL fragment. If a route succeeds with a
        // match, returns `true`. If no defined routes matches the fragment,
        // returns `false`.
        router.loadUrl = function(fragment) {
            var handlers = router.handlers;

            for (var i = 0; i < handlers.length; i++) {
                var current = handlers[i];
                if (current.route.test(fragment)) {
                    current.callback(fragment);
                    return true;
                }
            }

            return false;
        };

        router.updateDocumentTitle = function(instance, instruction) {
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

        router.navigate = function(fragment, options) {
            history.navigate(fragment, options);
        };

        router.navigateBack = function() {
            history.history.back();
        };

        router.afterCompose = function() {
            setTimeout(function() {
                isProcessing(false);
                router.trigger('router:navigation:composed', currentActivation, currentInstruction, router);
                dequeueInstruction();
            }, 10);
        };

        router.convertRouteToHash = function(route) {
            return "#" + route;
        };

        router.convertRouteToModuleId = function(route) {
            return stripParametersFromRoute(route);
        };

        router.convertRouteToTitle = function(route) {
            var value = stripParametersFromRoute(route);
            return value.substring(0, 1).toUpperCase() + value.substring(1);
        };

        // Manually bind a single named route to a module. For example:
        //
        //     router.map('search/:query/p:num', 'viewmodels/search');
        //
        router.map = function(route, config) {
            if (system.isArray(route)) {
                for (var i = 0; i < route.length; i++) {
                    router.map(route[i]);
                }

                return router;
            }

            if (system.isString(route) || system.isRegExp(route)) {
                if (!config) {
                    config = {};
                } else if (system.isString(config)) {
                    config = { moduleId: config };
                }

                config.route = route;
            } else {
                config = route;
            }

            return mapRoute(config);
        };

        router.buildNavigationModel = function(defaultOrder) {
            var nav = [], routes = router.routes;
            defaultOrder = defaultOrder || 100;

            for (var i = 0; i < routes.length; i++) {
                var current = routes[i];

                if (current.nav != undefined) {
                    if (!system.isNumber(current.nav)) {
                        current.nav = defaultOrder;
                    }

                    addActiveFlag(current);
                    nav.push(current);
                }
            }

            nav.sort(function(a, b) { return a.nav - b.nav; });
            router.navigationModel(nav);

            return router;
        };

        router.mapUnknownRoutes = function(config) {
            var route = routeStringToRegExp("*catchall");

            router.route(route, function(fragment) {
                var instruction = {
                    fragment: fragment,
                    config: { route: route },
                    params: extractParameters(route, fragment)
                };

                if (!config) {
                    instruction.config.moduleId = fragment;
                } else if (system.isString(config)) {
                    instruction.config.moduleId = config;
                } else if (system.isFunction(config)) {
                    var result = config(instruction);
                    if (result && result.then) {
                        result.then(function() {
                            router.trigger('router:route:mapping', instruction.config, router);
                            queueInstruction(instruction);
                        });
                        return;
                    }
                } else {
                    instruction.config = config;
                    instruction.config.route = route;
                }

                router.trigger('router:route:mapping', instruction.config, router);
                queueInstruction(instruction);
            });

            return router;
        };

        router.reset = function() {
            router.handlers = [];
            router.routes = [];
            delete router.options;
        };

        router.createChildRouter = function() {
            var childRouter = createRouter();
            childRouter.parent = router;
            return childRouter;
        };

        return router;
    };

    rootRouter = createRouter();

    rootRouter.activate = function(options) {
        return system.defer(function(dfd) {
            startDeferred = dfd;
            rootRouter.options = system.extend({ routeHandler: rootRouter.loadUrl }, rootRouter.options, options);
            history.activate(rootRouter.options);
        }).promise();
    };

    rootRouter.deactivate = function() {
        history.deactivate();
    };

    return rootRouter;
});