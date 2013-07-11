/**
 * Durandal 2.0.0-pre Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */
/**
 * Connects the history module's url and history tracking support to Durandal's activation and composition engine allowing you to easily build navigation-style applications.
 * @module router
 * @requires system
 * @requires app
 * @requires activator
 * @requires events
 * @requires composition
 * @requires history
 * @requires knockout
 * @requires jquery
 */
define(['durandal/system', 'durandal/app', 'durandal/activator', 'durandal/events', 'durandal/composition', 'plugins/history', 'knockout', 'jquery'], function(system, app, activator, events, composition, history, ko, $) {
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    var startDeferred, rootRouter;
    var trailingSlash = /\/$/;

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

    function compareArrays(first, second) {
        if (!first || !second){
            return false;
        }

        if (first.length != second.length) {
            return false;
        }

        for (var i = 0, len = first.length; i < len; i++) {
            if (first[i] != second[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @class Router
     * @uses Events
     */

    /**
     * Triggered when the navigation logic has completed.
     * @event router:navigation:complete
     * @param {object} instance The activated instance.
     * @param {object} instruction The routing instruction.
     * @param {Router} router The router.
     */

    /**
     * Triggered when the navigation has been cancelled.
     * @event router:navigation:cancelled
     * @param {object} instance The activated instance.
     * @param {object} instruction The routing instruction.
     * @param {Router} router The router.
     */

    /**
     * Triggered right before a route is activated.
     * @event router:route:activating
     * @param {object} instance The activated instance.
     * @param {object} instruction The routing instruction.
     * @param {Router} router The router.
     */

    /**
     * Triggered right before a route is configured.
     * @event router:route:before-config
     * @param {object} config The route config.
     * @param {Router} router The router.
     */

    /**
     * Triggered just after a route is configured.
     * @event router:route:after-config
     * @param {object} config The route config.
     * @param {Router} router The router.
     */

    /**
     * Triggered when the view for the activated instance is attached.
     * @event router:navigation:attached
     * @param {object} instance The activated instance.
     * @param {object} instruction The routing instruction.
     * @param {Router} router The router.
     */

    /**
     * Triggered when the composition that the activated instance participates in is complete.
     * @event router:navigation:composition-complete
     * @param {object} instance The activated instance.
     * @param {object} instruction The routing instruction.
     * @param {Router} router The router.
     */

    var createRouter = function() {
        var queue = [],
            isProcessing = ko.observable(false),
            currentActivation,
            currentInstruction,
            activeItem = activator.create();

        var router = {
            /**
             * The route handlers that are registered. Each handler consists of a `routePattern` and a `callback`.
             * @property {object[]} handlers
             */
            handlers: [],
            /**
             * The route configs that are registered.
             * @property {object[]} routes
             */
            routes: [],
            /**
             * The route configurations that have been designated as displayable in a nav ui (nav:true).
             * @property {KnockoutObservableArray} navigationModel
             */
            navigationModel: ko.observableArray([]),
            /**
             * The active item/screen based on the current navigation state.
             * @property {Activator} activeItem
             */
            activeItem: activeItem,
            /**
             * Indicates that the router (or a child router) is currently in the process of navigating.
             * @property {KnockoutComputed} isNavigating
             */
            isNavigating: ko.computed(function() {
                var current = activeItem();
                var processing = isProcessing();
                	var currentRouterIsProcesing = current
						&& current.router
						&& current.router != router
						&& current.router.isNavigating() ? true : false;
            	return  processing || currentRouterIsProcesing;
            }),
            __router__:true
        };

        events.includeIn(router);

        activeItem.settings.areSameItem = function (currentItem, newItem, currentActivationData, newActivationData) {
            if (currentItem == newItem) {
                return compareArrays(currentActivationData, newActivationData);
            }

            return false;
        };

        function completeNavigation(instance, instruction) {
            system.log('Navigation Complete', instance, instruction);

            var fromModuleId = system.getModuleId(currentActivation);
            if (fromModuleId) {
                router.trigger('router:navigation:from:' + fromModuleId);
            }

            currentActivation = instance;
            currentInstruction = instruction;

            var toModuleId = system.getModuleId(currentActivation);
            if (toModuleId) {
                router.trigger('router:navigation:to:' + toModuleId);
            }

            if (!hasChildRouter(instance)) {
                router.updateDocumentTitle(instance, instruction);
            }

            rootRouter.explicitNavigation = false;
            rootRouter.navigatingBack = false;
            router.trigger('router:navigation:complete', instance, instruction, router);
        }

        function cancelNavigation(instance, instruction) {
            system.log('Navigation Cancelled');

            if (currentInstruction) {
                router.navigate(currentInstruction.fragment, { trigger: false });
            }

            isProcessing(false);
            rootRouter.explicitNavigation = false;
            rootRouter.navigatingBack = false;
            router.trigger('router:navigation:cancelled', instance, instruction, router);
        }

        function redirect(url) {
            system.log('Navigation Redirecting');

            isProcessing(false);
            rootRouter.explicitNavigation = false;
            rootRouter.navigatingBack = false;
            router.navigate(url, { trigger: true, replace: true });
        }

        function activateRoute(activator, instance, instruction) {
            rootRouter.navigatingBack = !rootRouter.explicitNavigation && currentActivation != instruction.fragment;
            router.trigger('router:route:activating', instance, instruction, router);

            activator.activateItem(instance, instruction.params).then(function(succeeded, failData) {
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
                        router.attached();
                    }
                } else if(failData && failData.redirect){
                    redirect(failData.redirect);
                }else{
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
                    var instance = system.resolveObject(module);
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

            var queryParams = router.parseQueryString(queryString);
            if (queryParams) {
                params.push(queryParams);
            }

            return {
                params:params,
                queryParams:queryParams
            };
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
                var paramInfo = createParams(config.routePattern, fragment, queryString);
                queueInstruction({
                    fragment: fragment,
                    queryString:queryString,
                    config: config,
                    params: paramInfo.params,
                    queryParams:paramInfo.queryParams
                });
            });

            return router;
        }

        function addActiveFlag(config) {
            config.isActive = ko.computed(function() {
                return activeItem() && activeItem().__moduleId__ == config.moduleId;
            });
        }

        /**
         * Parses a query string into an object.
         * @method parseQueryString
         * @param {string} queryString The query string to parse.
         * @return {object} An object keyed according to the query string parameters.
         */
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

        /**
         * Add a route to be tested when the url fragment changes.
         * @method route
         * @param {RegEx} routePattern The route pattern to test against.
         * @param {function} callback The callback to execute when the route pattern is matched.
         */
        router.route = function(routePattern, callback) {
            router.handlers.push({ routePattern: routePattern, callback: callback });
        };

        /**
         * Attempt to load the specified URL fragment. If a route succeeds with a match, returns `true`. If no defined routes matches the fragment, returns `false`.
         * @method loadUrl
         * @param {string} fragment The URL fragment to find a match for.
         * @return {boolean} True if a match was found, false otherwise.
         */
        router.loadUrl = function(fragment) {
            var handlers = router.handlers,
                queryString = null,
                coreFragment = fragment,
                queryIndex = fragment.indexOf('?');

            if (queryIndex != -1) {
                coreFragment = fragment.substring(0, queryIndex);
                queryString = fragment.substr(queryIndex + 1);
            }

            coreFragment = coreFragment.replace(trailingSlash, '');

            for (var i = 0; i < handlers.length; i++) {
                var current = handlers[i];
                if (current.routePattern.test(coreFragment)) {
                    current.callback(coreFragment, queryString);
                    return true;
                }
            }

            system.log('Route Not Found');

            if (currentInstruction) {
                history.navigate(currentInstruction.fragment, { trigger:false, replace:true });
            }

            rootRouter.explicitNavigation = false;
            rootRouter.navigatingBack = false;

            return false;
        };

        /**
         * Updates the document title based on the activated module instance, the routing instruction and the app.title.
         * @method updateDocumentTitle
         * @param {object} instance The activated module.
         * @param {object} instruction The routing instruction associated with the action. It has a `config` property that references the original route mapping config.
         */
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

        /**
         * Save a fragment into the hash history, or replace the URL state if the
         * 'replace' option is passed. You are responsible for properly URL-encoding
         * the fragment in advance.
         * The options object can contain `trigger: true` if you wish to have the
         * route callback be fired (not usually desirable), or `replace: true`, if
         * you wish to modify the current URL without adding an entry to the history.
         * @method navigate
         * @param {string} fragment The url fragment to navigate to.
         * @param {object|boolean} options An options object with optional trigger and replace flags. You can also pass a boolean directly to set the trigger option.
         * @return {boolean} Returns true/false from loading the url.
         */
        router.navigate = function(fragment, options) {
            rootRouter.explicitNavigation = true;
            return history.navigate(fragment, options);
        };

        /**
         * Navigates back in the browser history.
         * @method navigateBack
         */
        router.navigateBack = function() {
            history.history.back();
        };

        router.attached = function() {
            setTimeout(function() {
                isProcessing(false);
                router.trigger('router:navigation:attached', currentActivation, currentInstruction, router);
                dequeueInstruction();
            }, 10);
        };

        router.compositionComplete = function(){
            router.trigger('router:navigation:composition-complete', currentActivation, currentInstruction, router);
        };

        /**
         * Converts a route to a hash suitable for binding to a link's href.
         * @method convertRouteToHash
         * @param {string} route
         * @return {string} The hash.
         */
        router.convertRouteToHash = function(route) {
            return "#" + route;
        };

        /**
         * Converts a route to a module id. This is only called if no module id is supplied as part of the route mapping.
         * @method convertRouteToModuleId
         * @param {string} route
         * @return {string} The module id.
         */
        router.convertRouteToModuleId = function(route) {
            return stripParametersFromRoute(route);
        };

        /**
         * Converts a route to a displayable title. This is only callef if no title is specified as part of the route mapping.
         * @method convertRouteToTitle
         * @param {string} route
         * @return {string} The title.
         */
        router.convertRouteToTitle = function(route) {
            var value = stripParametersFromRoute(route);
            return value.substring(0, 1).toUpperCase() + value.substring(1);
        };

        /**
         * Maps route patterns to modules.
         * @method map
         * @param {string|object|object[]} route A route, config or array of configs.
         * @param {object} [config] The config for the specified route.
         * @chainable
         * @example
         router.map([
            { route: '', title:'Home', moduleId: 'homeScreen', nav: true },
            { route: 'customer/:id', moduleId: 'customerDetails'}
         ]);
         */
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

        /**
         * Builds an observable array designed to bind a navigation UI to. The model will exist in the `navigationModel` property.
         * @method buildNavigationModel
         * @param {number} defaultOrder The default order to use for navigation visible routes that don't specify an order. The defualt is 100.
         * @chainable
         */
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

        /**
         * Configures how the router will handle unknown routes.
         * @method mapUnknownRoutes
         * @param {string|function} [config] If not supplied, then the router will map routes to modules with the same name.
         * If a string is supplied, it represents the module id to route all unknown routes to.
         * Finally, if config is a function, it will be called back with the route instruction containing the route info. The function can then modify the instruction by adding a moduleId and the router will take over from there.
         * @chainable
         */
        router.mapUnknownRoutes = function(config) {
            var route = "*catchall";
            var routePattern = routeStringToRegExp(route);
            
            router.route(routePattern, function (fragment, queryString) {
                var paramInfo = createParams(routePattern, fragment, queryString);
                var instruction = {
                    fragment: fragment,
                    queryString: queryString,
                    config: {
                        route: route,
                        routePattern: routePattern
                    },
                    params: paramInfo.params,
                    queryParams: paramInfo.queryParams
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

        /**
         * Resets the router by removing handlers, routes and previously configured options.
         * @method reset
         */
        router.reset = function() {
            router.handlers = [];
            router.routes = [];
            delete router.options;
        };

        /**
         * Makes all configured routes and/or module ids relative to a certain base url.
         * @method makeRelative
         * @param {string|object} settings If string, the value is used as the base for routes and module ids. If an object, you can specify route and/or moduleId separately.
         */
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

        /**
         * Creates a child router.
         * @method createChildRouter
         * @return {Router} The child router.
         */
        router.createChildRouter = function() {
            var childRouter = createRouter();
            childRouter.parent = router;
            return childRouter;
        };

        return router;
    };

    /**
     * @class RouterModule
     * @extends Router
     * @static
     */
    rootRouter = createRouter();
    rootRouter.explicitNavigation = false;
    rootRouter.navigatingBack = false;

    /**
     * Activates the router and the underlying history tracking mechanism.
     * @method activate
     * @return {Promise} A promise that resolves when the router is ready.
     */
    rootRouter.activate = function(options) {
        return system.defer(function(dfd) {
            startDeferred = dfd;
            rootRouter.options = system.extend({ routeHandler: rootRouter.loadUrl }, rootRouter.options, options);
            history.activate(rootRouter.options);
            $(document).on('click', 'a', function(){
                rootRouter.explicitNavigation = true;
            });
        }).promise();
    };

    /**
     * Disable history, perhaps temporarily. Not useful in a real app, but possibly useful for unit testing Routers.
     * @method deactivate
     */
    rootRouter.deactivate = function() {
        history.deactivate();
    };

    /**
     * Installs the router's custom ko binding handler.
     * @method install
     */
    rootRouter.install = function(){
        ko.bindingHandlers.router = {
            init: function() {
                return { controlsDescendantBindings: true };
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var settings = ko.utils.unwrapObservable(valueAccessor()) || {};

                if (settings.__router__) {
                    settings = {
                        model:settings.activeItem(),
                        attached:settings.attached,
                        compositionComplete:settings.compositionComplete,
                        activate: false
                    };
                } else {
                    var theRouter = ko.utils.unwrapObservable(settings.router || viewModel.router) || rootRouter;
                    settings.model = theRouter.activeItem();
                    settings.attached = theRouter.attached;
                    settings.compositionComplete = theRouter.compositionComplete;
                    settings.activate = false;
                }

                composition.compose(element, settings, bindingContext);
            }
        };

        ko.virtualElements.allowedBindings.router = true;
    };

    return rootRouter;
});
