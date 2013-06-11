define('plugins/router', ['durandal/system', 'durandal/app', 'durandal/activator', 'durandal/events', 'plugins/history'],
function(system, app, activator, events, history) {

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

    function stripParametersFromRoute(route) {
        var colonIndex = route.indexOf(':');
        var length = colonIndex > 0 ? colonIndex - 1 : route.length;
        return route.substring(0, length);
    }

    function hasChildRouter(instance) {
        return instance.router && instance.router.loadUrl;
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    var createRouter = function() {
        var queue = [],
            isProcessing = ko.observable(false),
            currentActivation,
            currentInstruction,
            activeItem = activator.create();

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

            if (currentActivation && currentActivation.__moduleId__) {
                router.trigger('router:navigatedFrom:' + currentActivation.__moduleId__);
            }

            currentActivation = instance;
            currentInstruction = instruction;

            if (currentActivation && currentActivation.__moduleId__) {
                router.trigger('router:navigatedTo:' + currentActivation.__moduleId__);
            }

            if (!hasChildRouter(instance)) {
                router.updateDocumentTitle(instance, instruction);
            }

            router.trigger('router:navigation:complete', instance, instruction, router);
        }

        function cancelNavigation(instance, instruction) {
            system.log('Navigation Cancelled');

            if (currentInstruction) {
                router.navigate(currentInstruction.fragment, { trigger: false });
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
                            fragment: instruction.fragment,
                            queryString: instruction.queryString
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
                var fullFragment = instruction.fragment;
                if (instruction.queryString) {
                    fullFragment += "?" + instruction.queryString;
                }
                
                instruction.router.loadUrl(fullFragment);
                return;
            }

            isProcessing(true);

            if (canReuseCurrentActivation(instruction)) {
                ensureActivation(activator.create(), currentActivation, instruction);
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
        
        // Given a route, and a URL fragment that it matches, return the array of
        // extracted decoded parameters. Empty or unmatched parameters will be
        // treated as `null` to normalize cross-browser behavior.
        function createParams(routePattern, fragment, queryString) {
            var params = routePattern.exec(fragment).slice(1);

            for (var i = 0; i < params.length; i++) {
                var current = params[i];
                params[i] = current ? decodeURIComponent(current) : null;
            }

            var queryObject = router.parseQueryString(queryString);
            if (queryObject) {
                params.push(queryObject);
            }

            return params;
        }

        function mapRoute(config) {
            router.trigger('router:route:before-config', config, router);

            if (!system.isRegExp(config.route)) {
                config.title = config.title || router.convertRouteToTitle(config.route);
                config.moduleId = config.moduleId || router.convertRouteToModuleId(config.route);
                config.hash = config.hash || router.convertRouteToHash(config.route);
                config.routePattern = routeStringToRegExp(config.route);
            }else{
                config.routePattern = config.route;
            }

            router.trigger('router:route:after-config', config, router);

            router.routes.push(config);

            router.route(config.routePattern, function(fragment, queryString) {
                queueInstruction({
                    fragment: fragment,
                    queryString:queryString,
                    config: config,
                    params: createParams(config.routePattern, fragment, queryString)
                });
            });

            return router;
        }

        function addActiveFlag(config) {
            config.isActive = ko.computed(function() {
                return activeItem() && activeItem().__moduleId__ == config.moduleId;
            });
        }

        router.parseQueryString = function (queryString) {
            var queryObject, pairs;

            if (!queryString) {
                return null;
            }
            
            pairs = queryString.split('&');

            if (pairs.length == 0) {
                return null;
            }

            queryObject = {};

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if (pair === '') {
                    continue;
                }

                var parts = pair.split('=');
                queryObject[parts[0]] = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, ' '));
            }

            return queryObject;
        };

        // Add a route to be tested when the fragment changes. Routes added later
        // may override previous routes.
        router.route = function(routePattern, callback) {
            router.handlers.push({ routePattern: routePattern, callback: callback });
        };

        // Attempt to load the current URL fragment. If a route succeeds with a
        // match, returns `true`. If no defined routes matches the fragment,
        // returns `false`.
        router.loadUrl = function(fragment) {
            var handlers = router.handlers,
                queryString = null,
                coreFragment = fragment,
                queryIndex = fragment.indexOf('?');

            if (queryIndex != -1) {
                coreFragment = fragment.substring(0, queryIndex);
                queryString = fragment.substr(queryIndex + 1);
            }

            for (var i = 0; i < handlers.length; i++) {
                var current = handlers[i];
                if (current.routePattern.test(coreFragment)) {
                    current.callback(coreFragment, queryString);
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

                if (current.nav) {
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
            var route = "*catchall";
            var routePattern = routeStringToRegExp(route);
            
            router.route(routePattern, function (fragment, queryString) {
                var instruction = {
                    fragment: fragment,
                    queryString: queryString,
                    config: {
                        route: route,
                        routePattern: routePattern
                    },
                    params: createParams(routePattern, fragment, queryString)
                };

                if (!config) {
                    instruction.config.moduleId = fragment;
                } else if (system.isString(config)) {
                    instruction.config.moduleId = config;
                } else if (system.isFunction(config)) {
                    var result = config(instruction);
                    if (result && result.then) {
                        result.then(function() {
                            router.trigger('router:route:before-config', instruction.config, router);
                            router.trigger('router:route:after-config', instruction.config, router);
                            queueInstruction(instruction);
                        });
                        return;
                    }
                } else {
                    instruction.config = config;
                    instruction.config.route = route;
                    instruction.config.routePattern = routePattern;
                }

                router.trigger('router:route:before-config', instruction.config, router);
                router.trigger('router:route:after-config', instruction.config, router);
                queueInstruction(instruction);
            });

            return router;
        };

        router.reset = function() {
            router.handlers = [];
            router.routes = [];
            delete router.options;
        };

        router.makeRelative = function(settings){
            if(system.isString(settings)){
                settings = {
                    moduleId:settings,
                    route:settings
                };
            }

            if(settings.moduleId && !endsWith(settings.moduleId, '/')){
                settings.moduleId += '/';
            }

            if(settings.route && !endsWith(settings.route, '/')){
                settings.route += '/';
            }

            this.on('router:route:before-config').then(function(config){
                if(settings.moduleId){
                    config.moduleId = settings.moduleId + config.moduleId;
                }

                if(settings.route){
                    if(config.route === ''){
                        config.route = settings.route.substring(0, settings.route.length - 1);
                    }else{
                        config.route = settings.route + config.route;
                    }
                }
            });

            return this;
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
