// name: sammy
// version: 0.7.1

// Sammy.js / http://sammyjs.org

(function ($, window) {
    (function (factory) {
        // Support module loading scenarios
        if (typeof define === 'function' && define.amd) {
            // AMD Anonymous Module
            define(['jquery'], factory);
        } else {
            // No module loader (plain <script> tag) - put directly in global namespace
            $.sammy = window.Sammy = factory($);
        }
    })

    (function ($) {
        var Sammy,
            PATH_REPLACER = "([^\/]+)",
            PATH_NAME_MATCHER = /:([\w\d]+)/g,
            QUERY_STRING_MATCHER = /\?([^#]*)?$/,
            // mainly for making `arguments` an Array
            _makeArray = function (nonarray) { return Array.prototype.slice.call(nonarray); },
            // borrowed from jQuery
            _isFunction = function (obj) { return Object.prototype.toString.call(obj) === "[object Function]"; },
            _isArray = function (obj) { return Object.prototype.toString.call(obj) === "[object Array]"; },
            _isRegExp = function (obj) { return Object.prototype.toString.call(obj) === "[object RegExp]"; },
            _decode = function (str) { return decodeURIComponent((str || '').replace(/\+/g, ' ')); },
            _encode = encodeURIComponent,
            _escapeHTML = function (s) {
                return String(s).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            },
            _routeWrapper = function (verb) {
                return function (path, callback) { return this.route.apply(this, [verb, path, callback]); };
            },
            _template_cache = {},
            _has_history = !!(window.history && history.pushState),
            loggers = [];

        Sammy = function () {
            /// <summary>
            ///  `Sammy` (also aliased as $.sammy) is not only the namespace for a
            /// number of prototypes, its also a top level method that allows for easy
            /// creation/management of `Sammy.Application` instances. There are a
            /// number of different forms for `Sammy()` but each returns an instance
            /// of `Sammy.Application`. When a new instance is created using
            /// `Sammy` it is added to an Object called `Sammy.apps`. This
            /// provides for an easy way to get at existing Sammy applications. Only one
            /// instance is allowed per `element_selector` so when calling
            /// `Sammy('selector')` multiple times, the first time will create
            /// the application and the following times will extend the application
            /// already added to that selector.
            /// </summary>
            /// <param name="selector" type="String">
            ///     A string containing a selector expression
            /// </param>
            /// <returns type="Sammy.Application" />

            var args = _makeArray(arguments),
                app, selector;
            Sammy.apps = Sammy.apps || {};
            if (args.length === 0 || args[0] && _isFunction(args[0])) { // Sammy()
                return Sammy.apply(Sammy, ['body'].concat(args));
            } else if (typeof (selector = args.shift()) == 'string') { // Sammy('#main')
                app = Sammy.apps[selector] || new Sammy.Application();
                app.element_selector = selector;
                if (args.length > 0) {
                    $.each(args, function (i, plugin) {
                        app.use(plugin);
                    });
                }
                // if the selector changes make sure the reference in Sammy.apps changes
                if (app.element_selector != selector) {
                    delete Sammy.apps[selector];
                }
                Sammy.apps[app.element_selector] = app;
                return app;
            }
        };

        Sammy.VERSION = '0.7.1';

        Sammy.addLogger = function (logger) {
            /// <summary>
            /// Add to the global logger pool. Takes a function that accepts an
            /// unknown number of arguments and should print them or send them somewhere
            /// The first argument is always a timestamp.
            /// </summary>
            /// <param name="logger" type="function">
            ///     A logger function
            /// </param>

            loggers.push(logger);
        };

        Sammy.log = function () {
            /// <summary>
            /// Sends a log message to each logger listed in the global
            /// loggers pool. Can take any number of arguments.
            /// Also prefixes the arguments with a timestamp.
            /// </summary>
            /// <param name="arguments" type="object">
            ///     Arguments
            /// </param>

            var args = _makeArray(arguments);
            args.unshift("[" + Date() + "]");
            $.each(loggers, function (i, logger) {
                logger.apply(Sammy, args);
            });
        };

        if (typeof window.console != 'undefined') {
            if (_isFunction(window.console.log.apply)) {
                Sammy.addLogger(function () {
                    window.console.log.apply(window.console, arguments);
                });
            } else {
                Sammy.addLogger(function () {
                    window.console.log(arguments);
                });
            }
        } else if (typeof console != 'undefined') {
            Sammy.addLogger(function () {
                console.log.apply(console, arguments);
            });
        }

        $.extend(Sammy, {
            makeArray: _makeArray,
            isFunction: _isFunction,
            isArray: _isArray
        });

        Sammy.Object = function (obj) {
            /// <summary>
            /// Sammy.Object is the base for all other Sammy classes. It provides some useful
            /// functionality, including cloning, iterating, etc.
            /// </summary>
            /// <param name="obj" type="object">
            ///     Base object
            /// </param>
            /// <returns type="Sammy.Object" />

            return $.extend(this, obj || {});
        };

        $.extend(Sammy.Object.prototype, {
            // Escape HTML in string, use in templates to prevent script injection.
            // Also aliased as `h()`
            escapeHTML: _escapeHTML,
            h: _escapeHTML,

            toHash: function () {
                /// <summary>
                // Returns a copy of the object with Functions removed.
                /// </summary>
                /// <returns type="Object" />

                var json = {};
                $.each(this, function (k, v) {
                    if (!_isFunction(v)) {
                        json[k] = v;
                    }
                });
                return json;
            },

            toHTML: function () {
                /// <summary>
                /// Renders a simple HTML version of this Objects attributes.
                /// Does not render functions.
                /// </summary>
                /// <returns type="String" />

                var display = "";
                $.each(this, function (k, v) {
                    if (!_isFunction(v)) {
                        display += "<strong>" + k + "</strong> " + v + "<br />";
                    }
                });
                return display;
            },

            keys: function (attributes_only) {
                /// <summary>
                /// Returns an array of keys for this object. If `attributes_only`
                /// is true will not return keys that map to a `function()`
                /// </summary>
                /// <param name="attributes_only" type="Boolean">
                ///     Defines whether return only attributes
                /// </param>
                /// <returns type="Array" />

                var keys = [];
                for (var property in this) {
                    if (!_isFunction(this[property]) || !attributes_only) {
                        keys.push(property);
                    }
                }
                return keys;
            },

            has: function (key) {
                /// <summary>
                /// Checks if the object has a value at `key` and that the value is not empty
                /// </summary>
                /// <param name="key" type="Object">
                ///     Key value
                /// </param>
                /// <returns type="Boolean" />

                return this[key] && $.trim(this[key].toString()) !== '';
            },

            join: function () {
                /// <summary>
                /// Convenience method to join as many arguments as you want
                /// by the first argument - useful for making paths
                /// </summary>
                /// <param name="delimiter" type="String">
                ///     Delimiter value
                /// </param>
                /// <param name="arguments" type="Object">
                ///     Values
                /// </param>
                /// <returns type="Array" />

                var args = _makeArray(arguments);
                var delimiter = args.shift();
                return args.join(delimiter);
            },

            log: function () {
                /// <summary>
                /// Shortcut to Sammy.log
                /// </summary>

                Sammy.log.apply(Sammy, arguments);
            },

            toString: function (include_functions) {
                /// <summary>
                /// Returns a string representation of this object.
                /// if `include_functions` is true, it will also toString() the
                /// methods of this object. By default only prints the attributes.
                /// </summary>
                /// <param name="include_functions" type="Boolean">
                ///     Defines whether include functions
                /// </param>
                /// <returns type="String" />

                var s = [];
                $.each(this, function (k, v) {
                    if (!_isFunction(v) || include_functions) {
                        s.push('"' + k + '": ' + v.toString());
                    }
                });
                return "Sammy.Object: {" + s.join(',') + "}";
            }
        });

        Sammy.DefaultLocationProxy = function (app, run_interval_every) {
            /// <summary>
            /// The DefaultLocationProxy is the default location proxy for all Sammy applications.
            /// A location proxy is a prototype that conforms to a simple interface. The purpose
            /// of a location proxy is to notify the Sammy.Application its bound to when the location
            /// or 'external state' changes.
            ///
            /// The `DefaultLocationProxy` watches for changes to the path of the current window and
            /// is also able to set the path based on changes in the application. It does this by
            /// using different methods depending on what is available in the current browser. In
            /// the latest and greatest browsers it used the HTML5 History API and the `pushState`
            /// `popState` events/methods. This allows you to use Sammy to serve a site behind normal
            /// URI paths as opposed to the older default of hash (#) based routing. Because the server
            /// can interpret the changed path on a refresh or re-entry, though, it requires additional
            /// support on the server side. If you'd like to force disable HTML5 history support, please
            /// use the `disable_push_state` setting on `Sammy.Application`. If pushState support
            /// is enabled, `DefaultLocationProxy` also binds to all links on the page. If a link is clicked
            /// that matches the current set of routes, the URL is changed using pushState instead of
            /// fully setting the location and the app is notified of the change.
            ///
            /// If the browser does not have support for HTML5 History, `DefaultLocationProxy` automatically
            /// falls back to the older hash based routing. The newest browsers (IE, Safari > 4, FF >= 3.6)
            /// support a 'onhashchange' DOM event, thats fired whenever the location.hash changes.
            /// In this situation the DefaultLocationProxy just binds to this event and delegates it to
            /// the application. In the case of older browsers a poller is set up to track changes to the
            /// hash.
            /// </summary>
            /// <param name="app" type="Sammy.Application">
            ///     Application
            /// </param>
            /// <param name="run_interval_every" type="Number">
            ///     Defines polling interval
            /// </param>
            /// <returns type="String" />

            this.app = app;
            // set is native to false and start the poller immediately
            this.is_native = false;
            this.has_history = _has_history;
            this._startPolling(run_interval_every);
        };

        Sammy.DefaultLocationProxy.fullPath = function (location_obj) {
            /// <summary>
            /// Bypass the `window.location.hash` attribute.  If a question mark
            /// appears in the hash IE6 will strip it and all of the following
            /// characters from `window.location.hash`.
            /// </summary>
            /// <param name="location_obj" type="Object">
            ///     Location object
            /// </param>
            /// <returns type="String" />

            var matches = location_obj.toString().match(/^[^#]*(#.+)$/);
            var hash = matches ? matches[1] : '';
            return [location_obj.pathname, location_obj.search, hash].join('');
        };
        $.extend(Sammy.DefaultLocationProxy.prototype, {
            bind: function () {
                /// <summary>
                /// bind the proxy events to the current app.
                /// </summary>

                var proxy = this, app = this.app, lp = Sammy.DefaultLocationProxy;
                $(window).bind('hashchange.' + this.app.eventNamespace(), function (e, non_native) {
                    // if we receive a native hash change event, set the proxy accordingly
                    // and stop polling
                    if (proxy.is_native === false && !non_native) {
                        proxy.is_native = true;
                        window.clearInterval(lp._interval);
                    }
                    app.trigger('location-changed');
                });
                if (_has_history && !app.disable_push_state) {
                    // bind to popstate
                    $(window).bind('popstate.' + this.app.eventNamespace(), function (e) {
                        app.trigger('location-changed');
                    });
                    // bind to link clicks that have routes
                    $('a').live('click.history-' + this.app.eventNamespace(), function (e) {
                        if (e.isDefaultPrevented() || e.metaKey || e.ctrlKey) {
                            return;
                        }
                        var full_path = lp.fullPath(this);
                        if (this.hostname == window.location.hostname &&
                            app.lookupRoute('get', full_path) &&
                            this.target !== '_blank') {
                            e.preventDefault();
                            proxy.setLocation(full_path);
                            return false;
                        }
                    });
                }
                if (!lp._bindings) {
                    lp._bindings = 0;
                }
                lp._bindings++;
            },

            unbind: function () {
                /// <summary>
                /// unbind the proxy events from the current app
                /// </summary>

                $(window).unbind('hashchange.' + this.app.eventNamespace());
                $(window).unbind('popstate.' + this.app.eventNamespace());
                $('a').die('click.history-' + this.app.eventNamespace());
                Sammy.DefaultLocationProxy._bindings--;
                if (Sammy.DefaultLocationProxy._bindings <= 0) {
                    window.clearInterval(Sammy.DefaultLocationProxy._interval);
                }
            },

            getLocation: function () {
                /// <summary>
                /// get the current location from the hash.
                /// </summary>
                /// <returns type="String" />

                return Sammy.DefaultLocationProxy.fullPath(window.location);
            },

            setLocation: function (new_location) {
                /// <summary>
                /// set the current location to `new_location`
                /// </summary>
                /// <param name="new_location" type="String">
                ///     New address
                /// </param>

                if (/^([^#\/]|$)/.test(new_location)) { // non-prefixed url
                    if (_has_history && !this.app.disable_push_state) {
                        new_location = '/' + new_location;
                    } else {
                        new_location = '#!/' + new_location;
                    }
                }
                if (new_location != this.getLocation()) {
                    // HTML5 History exists and new_location is a full path
                    if (_has_history && !this.app.disable_push_state && /^\//.test(new_location)) {
                        history.pushState({ path: new_location }, window.title, new_location);
                        this.app.trigger('location-changed');
                    } else {
                        return (window.location = new_location);
                    }
                }
            },

            _startPolling: function (every) {
                /// <summary>
                /// set up interval
                /// </summary>
                /// <param name="every" type="Number">
                ///     Polling interval
                /// </param>

                var proxy = this;
                if (!Sammy.DefaultLocationProxy._interval) {
                    if (!every) {
                        every = 10;
                    }
                    var hashCheck = function () {
                        var current_location = proxy.getLocation();
                        if (typeof Sammy.DefaultLocationProxy._last_location == 'undefined' ||
                            current_location != Sammy.DefaultLocationProxy._last_location) {
                            window.setTimeout(function () {
                                $(window).trigger('hashchange', [true]);
                            }, 0);
                        }
                        Sammy.DefaultLocationProxy._last_location = current_location;
                    };
                    hashCheck();
                    Sammy.DefaultLocationProxy._interval = window.setInterval(hashCheck, every);
                }
            }
        });


        Sammy.Application = function (app_function) {
            /// <summary>
            /// Sammy.Application is the Base prototype for defining 'applications'.
            /// An 'application' is a collection of 'routes' and bound events that is
            /// attached to an element when `run()` is called.
            /// The only argument an 'app_function' is evaluated within the context of the application.
            /// </summary>
            /// <param name="app_function" type="function">
            ///     Application function
            /// </param>

            var app = this;
            this.routes = {};
            this.listeners = new Sammy.Object({});
            this.arounds = [];
            this.befores = [];
            // generate a unique namespace
            this.namespace = (new Date()).getTime() + '-' + parseInt(Math.random() * 1000, 10);
            this.context_prototype = function () { Sammy.EventContext.apply(this, arguments); };
            this.context_prototype.prototype = new Sammy.EventContext();

            if (_isFunction(app_function)) {
                app_function.apply(this, [this]);
            }
            // set the location proxy if not defined to the default (DefaultLocationProxy)
            if (!this._location_proxy) {
                this.setLocationProxy(new Sammy.DefaultLocationProxy(this, this.run_interval_every));
            }
            if (this.debug) {
                this.bindToAllEvents(function (e, data) {
                    app.log(app.toString(), e.cleaned_type, data || {});
                });
            }
        };

        Sammy.Application.prototype = $.extend({}, Sammy.Object.prototype, {
            // the four route verbs
            ROUTE_VERBS: ['get', 'post', 'put', 'delete'],

            // An array of the default events triggered by the
            // application during its lifecycle
            APP_EVENTS: ['run', 'unload', 'lookup-route', 'run-route', 'route-found', 'event-context-before', 'event-context-after', 'changed', 'error', 'check-form-submission', 'redirect', 'location-changed'],

            _last_route: null,
            _location_proxy: null,
            _running: false,

            // Defines what element the application is bound to. Provide a selector
            // (parseable by `jQuery()`) and this will be used by `$element()`
            element_selector: 'body',

            // When set to true, logs all of the default events using `log()`
            debug: false,

            // When set to true, and the error() handler is not overridden, will actually
            // raise JS errors in routes (500) and when routes can't be found (404)
            raise_errors: false,

            // The time in milliseconds that the URL is queried for changes
            run_interval_every: 50,

            // if using the `DefaultLocationProxy` setting this to true will force the app to use
            // traditional hash based routing as opposed to the new HTML5 PushState support
            disable_push_state: false,

            // The default template engine to use when using `partial()` in an
            // `EventContext`. `template_engine` can either be a string that
            // corresponds to the name of a method/helper on EventContext or it can be a function
            // that takes two arguments, the content of the unrendered partial and an optional
            // JS object that contains interpolation data. Template engine is only called/referred
            // to if the extension of the partial is null or unknown. See `partial()`
            // for more information
            template_engine: null,

            toString: function () {
                /// <summary>
                /// //=> Sammy.Application: body
                /// </summary>
                /// <returns type="String" />

                return 'Sammy.Application:' + this.element_selector;
            },

            $element: function (selector) {
                /// <summary>
                /// returns a jQuery object of the Applications bound element.
                /// </summary>
                /// <returns type="jQuery" />

                return selector ? $(this.element_selector).find(selector) : $(this.element_selector);
            },

            use: function () {
                /// <summary>
                /// `use()` is the entry point for including Sammy plugins.
                /// The first argument to use should be a function() that is evaluated
                /// in the context of the current application, just like the `app_function`
                /// argument to the `Sammy.Application` constructor.
                ///
                /// Any additional arguments are passed to the app function sequentially.
                ///
                /// For much more detail about plugins, check out:
                /// http://sammyjs.org/docs/plugins
                /// </summary>
                /// <param name="plugin_name" type="String">
                ///     Plugin name
                /// </param>
                /// <returns type="Sammy.Application" />

                // flatten the arguments
                var args = _makeArray(arguments),
                    plugin = args.shift(),
                    plugin_name = plugin || '';
                try {
                    args.unshift(this);
                    if (typeof plugin == 'string') {
                        plugin_name = 'Sammy.' + plugin;
                        plugin = Sammy[plugin];
                    }
                    plugin.apply(this, args);
                } catch (e) {
                    if (typeof plugin === 'undefined') {
                        this.error("Plugin Error: called use() but plugin (" + plugin_name.toString() + ") is not defined", e);
                    } else if (!_isFunction(plugin)) {
                        this.error("Plugin Error: called use() but '" + plugin_name.toString() + "' is not a function", e);
                    } else {
                        this.error("Plugin Error", e);
                    }
                }
                return this;
            },

            setLocationProxy: function (new_proxy) {
                /// <summary>
                /// Sets the location proxy for the current app. By default this is set to
                /// a new `Sammy.DefaultLocationProxy` on initialization. However, you can set
                /// the location_proxy inside you're app function to give your app a custom
                /// location mechanism. See `Sammy.DefaultLocationProxy` and `Sammy.DataLocationProxy`
                /// for examples.
                ///
                /// `setLocationProxy()` takes an initialized location proxy.
                /// </summary>
                /// <param name="new_proxy" type="Sammy.DefaultLocationProxy">
                ///     Proxy object
                /// </param>

                var original_proxy = this._location_proxy;
                this._location_proxy = new_proxy;
                if (this.isRunning()) {
                    if (original_proxy) {
                        // if there is already a location proxy, unbind it.
                        original_proxy.unbind();
                    }
                    this._location_proxy.bind();
                }
            },

            log: function () {
                /// <summary>
                /// provide log() override for inside an app that includes the relevant application element_selector
                /// </summary>

                Sammy.log.apply(Sammy, Array.prototype.concat.apply([this.element_selector], arguments));
            },

            route: function (verb, path, callback) {
                /// <summary>
                /// `route()` is the main method for defining routes within an application.
                /// For great detail on routes, check out:
                /// http://sammyjs.org/docs/routes
                ///
                /// This method also has aliases for each of the different verbs (eg. `get()`, `post()`, etc.)
                /// <param name="verb" type="String">
                /// A String in the set of ROUTE_VERBS or 'any'. 'any' will add routes for each
                ///    of the ROUTE_VERBS. If only two arguments are passed,
                ///    the first argument is the path, the second is the callback and the verb
                ///    is assumed to be 'any'.
                /// </param>
                /// <param name="path" type="String">
                /// A Regexp or a String representing the path to match to invoke this verb.
                /// </param>
                /// <param name="callback" type="Function">
                /// A Function that is called/evaluated when the route is run see: `runRoute()`.
                ///    It is also possible to pass a string as the callback, which is looked up as the name
                ///    of a method on the application.
                /// </param>
                /// </summary>
                /// <returns type="Sammy.Application" />

                var app = this, param_names = [], add_route, path_match;

                // if the method signature is just (path, callback)
                // assume the verb is 'any'
                if (!callback && _isFunction(path)) {
                    path = verb;
                    callback = path;
                    verb = 'any';
                }

                verb = verb.toLowerCase(); // ensure verb is lower case

                // if path is a string turn it into a regex
                if (path.constructor == String) {

                    // Needs to be explicitly set because IE will maintain the index unless NULL is returned,
                    // which means that with two consecutive routes that contain params, the second set of params will not be found and end up in splat instead of params
                    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/RegExp/lastIndex
                    PATH_NAME_MATCHER.lastIndex = 0;

                    // find the names
                    while ((path_match = PATH_NAME_MATCHER.exec(path)) !== null) {
                        param_names.push(path_match[1]);
                    }
                    // replace with the path replacement
                    path = new RegExp(path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
                }
                // lookup callback
                if (typeof callback == 'string') {
                    callback = app[callback];
                }

                add_route = function (with_verb) {
                    var r = { verb: with_verb, path: path, callback: callback, param_names: param_names };
                    // add route to routes array
                    app.routes[with_verb] = app.routes[with_verb] || [];
                    // place routes in order of definition
                    app.routes[with_verb].push(r);
                };

                if (verb === 'any') {
                    $.each(this.ROUTE_VERBS, function (i, v) { add_route(v); });
                } else {
                    add_route(verb);
                }

                // return the app
                return this;
            },

            // Alias for route('get', ...)
            get: _routeWrapper('get'),

            // Alias for route('post', ...)
            post: _routeWrapper('post'),

            // Alias for route('put', ...)
            put: _routeWrapper('put'),

            // Alias for route('delete', ...)
            del: _routeWrapper('delete'),

            // Alias for route('any', ...)
            any: _routeWrapper('any'),

            mapRoutes: function (route_array) {
                /// <summary>
                /// `mapRoutes` takes an array of arrays, each array being passed to route()
                /// as arguments, this allows for mass definition of routes. Another benefit is
                /// this makes it possible/easier to load routes via remote JSON.
                /// </summary>
                /// <param name="route_array" type="Array">
                ///     Routes
                /// </param>
                /// <returns type="Sammy.Application" />

                var app = this;
                $.each(route_array, function (i, route_args) {
                    app.route.apply(app, route_args);
                });
                return this;
            },

            eventNamespace: function () {
                /// <summary>
                /// A unique event namespace defined per application.
                /// All events bound with `bind()` are automatically bound within this space.
                /// </summary>
                /// <returns type="String" />

                return ['sammy-app', this.namespace].join('-');
            },

            bind: function (name, data, callback) {
                /// <summary>
                /// Works just like `jQuery.fn.bind()` with a couple notable differences.
                ///
                /// * It binds all events to the application element
                /// * All events are bound within the `eventNamespace()`
                /// * Events are not actually bound until the application is started with `run()`
                /// * callbacks are evaluated within the context of a Sammy.EventContext
                /// </summary>
                /// <param name="name" type="String">
                ///     Event name
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <returns type="Sammy.Application" />

                var app = this;
                // build the callback
                // if the arity is 2, callback is the second argument
                if (typeof callback == 'undefined') {
                    callback = data;
                }
                var listener_callback = function () {
                    // pull off the context from the arguments to the callback
                    var e, context, data;
                    e = arguments[0];
                    data = arguments[1];
                    if (data && data.context) {
                        context = data.context;
                        delete data.context;
                    } else {
                        context = new app.context_prototype(app, 'bind', e.type, data, e.target);
                    }
                    e.cleaned_type = e.type.replace(app.eventNamespace(), '');
                    callback.apply(context, [e, data]);
                };

                // it could be that the app element doesnt exist yet
                // so attach to the listeners array and then run()
                // will actually bind the event.
                if (!this.listeners[name]) {
                    this.listeners[name] = [];
                }
                this.listeners[name].push(listener_callback);
                if (this.isRunning()) {
                    // if the app is running
                    // *actually* bind the event to the app element
                    this._listen(name, listener_callback);
                }
                return this;
            },

            trigger: function (name, data) {
                /// <summary>
                /// Triggers custom events defined with `bind()`
                /// </summary>
                /// <param name="name" type="String">
                ///     The name of the event. Automatically prefixed with the `eventNamespace()`
                /// </param>
                /// <param name="data" type="Object">
                ///     An optional Object that can be passed to the bound callback.
                /// </param>
                /// <returns type="Sammy.Application" />

                this.$element().trigger([name, this.eventNamespace()].join('.'), [data]);
                return this;
            },

            refresh: function () {
                /// <summary>
                /// Reruns the current route
                /// </summary>
                /// <returns type="Sammy.Application" />

                this.last_location = null;
                this.trigger('location-changed');
                return this;
            },

            before: function (options, callback) {
                /// <summary>
                /// Takes a single callback that is pushed on to a stack.
                /// Before any route is run, the callbacks are evaluated in order within
                /// the current `Sammy.EventContext`
                ///
                /// If any of the callbacks explicitly return false, execution of any
                /// further callbacks and the route itself is halted.
                ///
                /// You can also provide a set of options that will define when to run this
                /// before based on the route it proceeds.
                /// </summary>
                /// <param name="options" type="Object">
                ///     Options
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <returns type="Sammy.Application" />

                if (_isFunction(options)) {
                    callback = options;
                    options = {};
                }
                this.befores.push([options, callback]);
                return this;
            },

            after: function (callback) {
                /// <summary>
                /// A shortcut for binding a callback to be run after a route is executed.
                /// After callbacks have no guarunteed order.
                /// </summary>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <returns type="Sammy.Application" />

                return this.bind('event-context-after', callback);
            },

            around: function (callback) {
                /// <summary>
                /// Adds an around filter to the application. around filters are functions
                /// that take a single argument `callback` which is the entire route
                /// execution path wrapped up in a closure. This means you can decide whether
                /// or not to proceed with execution by not invoking `callback` or,
                /// more usefully wrapping callback inside the result of an asynchronous execution.
                /// </summary>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <returns type="Sammy.Application" />

                this.arounds.push(callback);
                return this;
            },

            isRunning: function () {
                /// <summary>
                /// Returns `true` if the current application is running.
                /// </summary>
                /// <returns type="Boolean" />
                return this._running;
            },

            helpers: function (extensions) {
                /// <summary>
                /// Helpers extends the EventContext prototype specific to this app.
                /// This allows you to define app specific helper functions that can be used
                /// whenever you're inside of an event context (templates, routes, bind).
                /// </summary>
                /// <param name="extensions" type="Object">
                ///     Extension object
                /// </param>
                /// <returns type="Sammy.Application" />

                $.extend(this.context_prototype.prototype, extensions);
                return this;
            },

            helper: function (name, method) {
                /// <summary>
                /// Helper extends the event context just like `helpers()` but does it
                /// a single method at a time. This is especially useful for dynamically named
                /// helpers
                /// </summary>
                /// <param name="name" type="String">
                ///     Property name
                /// </param>
                /// <param name="name" type="Object">
                ///     Property value
                /// </param>
                /// <returns type="Sammy.Application" />

                this.context_prototype.prototype[name] = method;
                return this;
            },

            run: function (start_url) {
                /// <summary>
                /// Actually starts the application's lifecycle. `run()` should be invoked
                /// within a document.ready block to ensure the DOM exists before binding events, etc.
                /// </summary>
                /// <param name="start_url" type="String">
                ///     Optionally, a String can be passed which the App will redirect to
                ///     after the events/routes have been bound.
                /// </param>
                /// <returns type="Sammy.Application" />

                if (this.isRunning()) {
                    return false;
                }
                var app = this;

                // actually bind all the listeners
                $.each(this.listeners.toHash(), function (name, callbacks) {
                    $.each(callbacks, function (i, listener_callback) {
                        app._listen(name, listener_callback);
                    });
                });

                this.trigger('run', { start_url: start_url });
                this._running = true;
                // set last location
                this.last_location = null;
                if (!(/\#(.+)/.test(this.getLocation())) && typeof start_url != 'undefined') {
                    this.setLocation(start_url);
                }
                // check url
                this._checkLocation();
                this._location_proxy.bind();
                this.bind('location-changed', function () {
                    app._checkLocation();
                });

                // bind to submit to capture post/put/delete routes
                this.bind('submit', function (e) {
                    var returned = app._checkFormSubmission($(e.target).closest('form'));
                    return (returned === false) ? e.preventDefault() : false;
                });

                // bind unload to body unload
                $(window).bind('unload', function () {
                    app.unload();
                });

                // trigger html changed
                return this.trigger('changed');
            },

            unload: function () {
                /// <summary>
                /// The opposite of `run()`, un-binds all event listeners and intervals
                /// `run()` Automatically binds a `onunload` event to run this when
                /// the document is closed.
                /// </summary>
                /// <returns type="Sammy.Application" />

                if (!this.isRunning()) {
                    return false;
                }
                var app = this;
                this.trigger('unload');
                // clear interval
                this._location_proxy.unbind();
                // unbind form submits
                this.$element().unbind('submit').removeClass(app.eventNamespace());
                // unbind all events
                $.each(this.listeners.toHash(), function (name, listeners) {
                    $.each(listeners, function (i, listener_callback) {
                        app._unlisten(name, listener_callback);
                    });
                });
                this._running = false;
                return this;
            },

            bindToAllEvents: function (callback) {
                /// <summary>
                /// Will bind a single callback function to every event that is already
                /// being listened to in the app. This includes all the `APP_EVENTS`
                /// as well as any custom events defined with `bind()`.
                ///
                /// Used internally for debug logging.
                /// </summary>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <returns type="Sammy.Application" />

                var app = this;
                // bind to the APP_EVENTS first
                $.each(this.APP_EVENTS, function (i, e) {
                    app.bind(e, callback);
                });
                // next, bind to listener names (only if they dont exist in APP_EVENTS)
                $.each(this.listeners.keys(true), function (i, name) {
                    if ($.inArray(name, app.APP_EVENTS) == -1) {
                        app.bind(name, callback);
                    }
                });
                return this;
            },

            routablePath: function (path) {
                /// <summary>
                /// Returns a copy of the given path with any query string after the hash
                /// removed.
                /// </summary>
                /// <param name="path" type="String">
                ///     Path value
                /// </param>
                /// <returns type="String" />

                return path.replace(QUERY_STRING_MATCHER, '');
            },

            lookupRoute: function (verb, path) {
                /// <summary>
                /// Given a verb and a String path, will return either a route object or false
                /// if a matching route can be found within the current defined set.
                /// </summary>
                /// <param name="verb" type="String">
                ///     A String for the verb
                /// </param>
                /// <param name="path" type="String">
                ///     A String path to lookup
                /// </param>
                /// <returns type="Boolean" />

                var app = this, routed = false, i = 0, l, route;
                if (typeof this.routes[verb] != 'undefined') {
                    l = this.routes[verb].length;
                    for (; i < l; i++) {
                        route = this.routes[verb][i];
                        if (app.routablePath(path).match(route.path)) {
                            routed = route;
                            break;
                        }
                    }
                }
                return routed;
            },

            runRoute: function (verb, path, params, target) {
                /// <summary>
                /// First, invokes `lookupRoute()` and if a route is found, parses the
                /// possible URL params and then invokes the route's callback within a new
                /// `Sammy.EventContext`. If the route can not be found, it calls
                /// `notFound()`. If `raise_errors` is set to `true` and
                /// the `error()` has not been overridden, it will throw an actual JS
                /// error.
                ///
                /// You probably will never have to call this directly.
                /// </summary>
                /// <param name="verb" type="String">
                ///     A String for the verb
                /// </param>
                /// <param name="path" type="String">
                ///     A String path to lookup
                /// </param>
                /// <param name="params" type="Object">
                ///     An Object of Params pulled from the URI or passed directly
                /// </param>
                /// <returns type="Number" />

                var app = this,
                    route = this.lookupRoute(verb, path),
                    context,
                    wrapped_route,
                    arounds,
                    around,
                    befores,
                    before,
                    callback_args,
                    path_params,
                    final_returned;

                this.log('runRoute', [verb, path].join(' '));
                this.trigger('run-route', { verb: verb, path: path, params: params });
                if (typeof params == 'undefined') {
                    params = {};
                }

                $.extend(params, this._parseQueryString(path));

                if (route) {
                    this.trigger('route-found', { route: route });
                    // pull out the params from the path
                    if ((path_params = route.path.exec(this.routablePath(path))) !== null) {
                        // first match is the full path
                        path_params.shift();
                        // for each of the matches
                        $.each(path_params, function (i, param) {
                            // if theres a matching param name
                            if (route.param_names[i]) {
                                // set the name to the match
                                params[route.param_names[i]] = _decode(param);
                            } else {
                                // initialize 'splat'
                                if (!params.splat) {
                                    params.splat = [];
                                }
                                params.splat.push(_decode(param));
                            }
                        });
                    }

                    // set event context
                    context = new this.context_prototype(this, verb, path, params, target);
                    // ensure arrays
                    arounds = this.arounds.slice(0);
                    befores = this.befores.slice(0);
                    // set the callback args to the context + contents of the splat
                    callback_args = [context].concat(params.splat);
                    // wrap the route up with the before filters
                    wrapped_route = function () {
                        var returned;
                        while (befores.length > 0) {
                            before = befores.shift();
                            // check the options
                            if (app.contextMatchesOptions(context, before[0])) {
                                returned = before[1].apply(context, [context]);
                                if (returned === false) {
                                    return false;
                                }
                            }
                        }
                        app.last_route = route;
                        context.trigger('event-context-before', { context: context });
                        returned = route.callback.apply(context, callback_args);
                        context.trigger('event-context-after', { context: context });
                        return returned;
                    };
                    $.each(arounds.reverse(), function (i, around) {
                        var last_wrapped_route = wrapped_route;
                        wrapped_route = function () { return around.apply(context, [last_wrapped_route]); };
                    });
                    try {
                        final_returned = wrapped_route();
                    } catch (e) {
                        this.error(['500 Error', verb, path].join(' '), e);
                    }
                    return final_returned;
                } else {
                    return this.notFound(verb, path);
                }
            },

            contextMatchesOptions: function (context, match_options, positive) {
                /// <summary>
                /// Matches an object of options against an `EventContext` like object that
                /// contains `path` and `verb` attributes. Internally Sammy uses this
                /// for matching `before()` filters against specific options. You can set the
                /// object to _only_ match certain paths or verbs, or match all paths or verbs _except_
                /// those that match the options.
                /// </summary>
                /// <param name="context" type="Sammy.Application">
                ///     Context
                /// </param>
                /// <param name="match_options" type="Object">
                ///     Options
                /// </param>
                /// <param name="positive" type="Boolean">
                ///     Defines whether invertion is required
                /// </param>
                /// <returns type="Boolean" />

                var options = match_options;
                // normalize options
                if (typeof options === 'string' || _isRegExp(options)) {
                    options = { path: options };
                }
                if (typeof positive === 'undefined') {
                    positive = true;
                }
                // empty options always match
                if ($.isEmptyObject(options)) {
                    return true;
                }
                // Do we have to match against multiple paths?
                if (_isArray(options.path)) {
                    var results, numopt, opts, len;
                    results = [];
                    for (numopt = 0, len = options.path.length; numopt < len; numopt += 1) {
                        opts = $.extend({}, options, { path: options.path[numopt] });
                        results.push(this.contextMatchesOptions(context, opts));
                    }
                    var matched = $.inArray(true, results) > -1 ? true : false;
                    return positive ? matched : !matched;
                }
                if (options.only) {
                    return this.contextMatchesOptions(context, options.only, true);
                } else if (options.except) {
                    return this.contextMatchesOptions(context, options.except, false);
                }
                var path_matched = true, verb_matched = true;
                if (options.path) {
                    if (!_isRegExp(options.path)) {
                        options.path = new RegExp(options.path.toString() + '$');
                    }
                    path_matched = options.path.test(context.path);
                }
                if (options.verb) {
                    if (typeof options.verb === 'string') {
                        verb_matched = options.verb === context.verb;
                    } else {
                        verb_matched = options.verb.indexOf(context.verb) > -1;
                    }
                }
                return positive ? (verb_matched && path_matched) : !(verb_matched && path_matched);
            },

            getLocation: function () {
                /// <summary>
                /// Delegates to the `location_proxy` to get the current location.
                /// See `Sammy.DefaultLocationProxy` for more info on location proxies.
                /// </summary>
                /// <returns type="String" />

                return this._location_proxy.getLocation();
            },

            setLocation: function (new_location) {
                /// <summary>
                /// Delegates to the `location_proxy` to set the current location.
                /// See `Sammy.DefaultLocationProxy` for more info on location proxies.
                /// </summary>
                /// <param name="new_location" type="String">
                ///     A new location string (e.g. '#/')
                /// </param>
                /// <returns type="String" />

                return this._location_proxy.setLocation(new_location);
            },

            swap: function (content, callback) {
                /// <summary>
                /// Swaps the content of `$element()` with `content`
                /// You can override this method to provide an alternate swap behavior
                /// for `EventContext.partial()`.
                /// </summary>
                /// <param name="content" type="String">
                ///     A new content
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <returns type="jQuery" />

                var $el = this.$element().html(content);
                if (_isFunction(callback)) {
                    callback(content);
                }
                return $el;
            },

            templateCache: function (key, value) {
                /// <summary>
                /// a simple global cache for templates. Uses the same semantics as
                /// `Sammy.Cache` and `Sammy.Storage` so can easily be replaced with
                /// a persistent storage that lasts beyond the current request.
                /// </summary>
                /// <param name="key" type="String">
                ///     Key
                /// </param>
                /// <param name="value" type="Object">
                ///     Value
                /// </param>
                /// <returns type="Object" />

                if (typeof value != 'undefined') {
                    return _template_cache[key] = value;
                } else {
                    return _template_cache[key];
                }
            },

            clearTemplateCache: function () {
                /// <summary>
                /// clear the templateCache
                /// </summary>

                return _template_cache = {};
            },

            notFound: function (verb, path) {
                /// <summary>
                /// This throws a '404 Not Found' error by invoking `error()`.
                /// Override this method or `error()` to provide custom
                /// 404 behavior (i.e redirecting to / or showing a warning)
                /// </summary>
                /// <param name="verb" type="String">
                ///     Http verb
                /// </param>
                /// <param name="path" type="String">
                ///     Path value
                /// </param>

                var ret = this.error(['404 Not Found', verb, path].join(' '));
                return (verb === 'get') ? ret : true;
            },

            error: function (message, original_error) {
                /// <summary>
                /// The base error handler takes a string `message` and an `Error`
                /// object. If `raise_errors` is set to `true` on the app level,
                /// this will re-throw the error to the browser. Otherwise it will send the error
                /// to `log()`. Override this method to provide custom error handling
                /// e.g logging to a server side component or displaying some feedback to the
                /// user.
                /// </summary>
                /// <param name="message" type="String">
                ///     Message
                /// </param>
                /// <param name="original_error" type="String">
                ///     Error value
                /// </param>

                if (!original_error) {
                    original_error = new Error();
                }
                original_error.message = [message, original_error.message].join(' ');
                this.trigger('error', { message: original_error.message, error: original_error });
                if (this.raise_errors) {
                    throw (original_error);
                } else {
                    this.log(original_error.message, original_error);
                }
            },

            _checkLocation: function () {
                var location, returned;
                // get current location
                location = this.getLocation();
                // compare to see if hash has changed
                if (!this.last_location || this.last_location[0] != 'get' || this.last_location[1] != location) {
                    // reset last location
                    this.last_location = ['get', location];
                    // lookup route for current hash
                    returned = this.runRoute('get', location);
                }
                return returned;
            },

            _getFormVerb: function (form) {
                var $form = $(form), verb, $_method;
                $_method = $form.find('input[name="_method"]');
                if ($_method.length > 0) {
                    verb = $_method.val();
                }
                if (!verb) {
                    verb = $form[0].getAttribute('method');
                }
                if (!verb || verb == '') {
                    verb = 'get';
                }
                return $.trim(verb.toString().toLowerCase());
            },

            _checkFormSubmission: function (form) {
                var $form, path, verb, params, returned;
                this.trigger('check-form-submission', { form: form });
                $form = $(form);
                path = $form.attr('action') || '';
                verb = this._getFormVerb($form);
                this.log('_checkFormSubmission', $form, path, verb);
                if (verb === 'get') {
                    params = this._serializeFormParams($form);
                    if (params !== '') {
                        path += '?' + params;
                    }
                    this.setLocation(path);
                    returned = false;
                } else {
                    params = $.extend({}, this._parseFormParams($form));
                    returned = this.runRoute(verb, path, params, form.get(0));
                }
                return (typeof returned == 'undefined') ? false : returned;
            },

            _serializeFormParams: function ($form) {
                var queryString = "",
                    fields = $form.serializeArray(),
                    i;
                if (fields.length > 0) {
                    queryString = this._encodeFormPair(fields[0].name, fields[0].value);
                    for (i = 1; i < fields.length; i++) {
                        queryString = queryString + "&" + this._encodeFormPair(fields[i].name, fields[i].value);
                    }
                }
                return queryString;
            },

            _encodeFormPair: function (name, value) {
                return _encode(name) + "=" + _encode(value);
            },

            _parseFormParams: function ($form) {
                var params = {},
                    form_fields = $form.serializeArray(),
                    i;
                for (i = 0; i < form_fields.length; i++) {
                    params = this._parseParamPair(params, form_fields[i].name, form_fields[i].value);
                }
                return params;
            },

            _parseQueryString: function (path) {
                var params = {}, parts, pairs, pair, i;

                parts = path.match(QUERY_STRING_MATCHER);
                if (parts && parts[1]) {
                    pairs = parts[1].split('&');
                    for (i = 0; i < pairs.length; i++) {
                        pair = pairs[i].split('=');
                        params = this._parseParamPair(params, _decode(pair[0]), _decode(pair[1] || ""));
                    }
                }
                return params;
            },

            _parseParamPair: function (params, key, value) {
                if (typeof params[key] !== 'undefined') {
                    if (_isArray(params[key])) {
                        params[key].push(value);
                    } else {
                        params[key] = [params[key], value];
                    }
                } else {
                    params[key] = value;
                }
                return params;
            },

            _listen: function (name, callback) {
                return this.$element().bind([name, this.eventNamespace()].join('.'), callback);
            },

            _unlisten: function (name, callback) {
                return this.$element().unbind([name, this.eventNamespace()].join('.'), callback);
            }
        });

        Sammy.RenderContext = function (event_context) {
            /// <summary>
            /// `Sammy.RenderContext` is an object that makes sequential template loading,
            /// rendering and interpolation seamless even when dealing with asynchronous
            /// operations.
            ///
            /// `RenderContext` objects are not usually created directly, rather they are
            /// instantiated from an `Sammy.EventContext` by using `render()`, `load()` or
            /// `partial()` which all return `RenderContext` objects.
            ///
            /// `RenderContext` methods always returns a modified `RenderContext`
            /// for chaining (like jQuery itself).
            ///
            /// The core magic is in the `then()` method which puts the callback passed as
            /// an argument into a queue to be executed once the previous callback is complete.
            /// All the methods of `RenderContext` are wrapped in `then()` which allows you
            /// to queue up methods by chaining, but maintaining a guaranteed execution order
            /// even with remote calls to fetch templates.
            /// </summary>
            /// <param name="event_context" type="Object">
            ///     Event context
            /// </param>

            this.event_context = event_context;
            this.callbacks = [];
            this.previous_content = null;
            this.content = null;
            this.next_engine = false;
            this.waiting = false;
        };

        Sammy.RenderContext.prototype = $.extend({}, Sammy.Object.prototype, {
            then: function (callback) {
                /// <summary>
                /// The "core" of the `RenderContext` object, adds the `callback` to the
                /// queue. If the context is `waiting` (meaning an async operation is happening)
                /// then the callback will be executed in order, once the other operations are
                /// complete. If there is no currently executing operation, the `callback`
                /// is executed immediately.
                ///
                /// The value returned from the callback is stored in `content` for the
                /// subsequent operation. If you return `false`, the queue will pause, and
                /// the next callback in the queue will not be executed until `next()` is
                /// called. This allows for the guaranteed order of execution while working
                /// with async operations.
                ///
                /// If then() is passed a string instead of a function, the string is looked
                /// up as a helper method on the event context.
                /// </summary>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>

                if (!_isFunction(callback)) {
                    // if a string is passed to then, assume we want to call
                    // a helper on the event context in its context
                    if (typeof callback === 'string' && callback in this.event_context) {
                        var helper = this.event_context[callback];
                        callback = function (content) {
                            return helper.apply(this.event_context, [content]);
                        };
                    } else {
                        return this;
                    }
                }
                var context = this;
                if (this.waiting) {
                    this.callbacks.push(callback);
                } else {
                    this.wait();
                    window.setTimeout(function () {
                        var returned = callback.apply(context, [context.content, context.previous_content]);
                        if (returned !== false) {
                            context.next(returned);
                        }
                    }, 0);
                }
                return this;
            },

            wait: function () {
                /// <summary>
                /// Pause the `RenderContext` queue. Combined with `next()` allows for async
                /// operations.
                /// </summary>

                this.waiting = true;
            },

            next: function (content) {
                /// <summary>
                /// Resume the queue, setting `content` to be used in the next operation.
                /// See `wait()` for an example.
                /// </summary>
                /// <param name="content" type="String">
                ///     Content
                /// </param>

                this.waiting = false;
                if (typeof content !== 'undefined') {
                    this.previous_content = this.content;
                    this.content = content;
                }
                if (this.callbacks.length > 0) {
                    this.then(this.callbacks.shift());
                }
            },

            load: function (location, options, callback) {
                /// <summary>
                /// Load a template into the context.
                /// The `location` can either be a string specifying the remote path to the
                /// file, a jQuery object, or a DOM element.
                ///
                /// No interpolation happens by default, the content is stored in
                /// `content`.
                ///
                /// In the case of a path, unless the option `{cache: false}` is passed the
                /// data is stored in the app's `templateCache()`.
                ///
                /// If a jQuery or DOM object is passed the `innerHTML` of the node is pulled in.
                /// This is useful for nesting templates as part of the initial page load wrapped
                /// in invisible elements or `&lt;script&gt;` tags. With template paths, the template
                /// engine is looked up by the extension. For DOM/jQuery embedded templates,
                /// this isnt possible, so there are a couple of options:
                ///
                ///  * pass an `{engine:}` option.
                ///  * define the engine in the `data-engine` attribute of the passed node.
                ///  * just store the raw template data and use `interpolate()` manually
                ///
                /// If a `callback` is passed it is executed after the template load.
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="options" type="Object">
                ///     Options
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>

                var context = this;
                return this.then(function () {
                    var should_cache, cached, is_json, location_array;
                    if (_isFunction(options)) {
                        callback = options;
                        options = {};
                    } else {
                        options = $.extend({}, options);
                    }
                    if (callback) {
                        this.then(callback);
                    }
                    if (typeof location === 'string') {
                        // it's a path
                        is_json = (location.match(/\.json$/) || options.json);
                        should_cache = is_json ? options.cache === true : options.cache !== false;
                        context.next_engine = context.event_context.engineFor(location);
                        delete options.cache;
                        delete options.json;
                        if (options.engine) {
                            context.next_engine = options.engine;
                            delete options.engine;
                        }
                        if (should_cache && (cached = this.event_context.app.templateCache(location))) {
                            return cached;
                        }
                        this.wait();
                        $.ajax($.extend({
                            url: location,
                            data: {},
                            dataType: is_json ? 'json' : 'text',
                            type: 'get',
                            success: function (data) {
                                if (should_cache) {
                                    context.event_context.app.templateCache(location, data);
                                }
                                context.next(data);
                            }
                        }, options));
                        return false;
                    } else {
                        // it's a dom/jQuery
                        if (location.nodeType) {
                            return location.innerHTML;
                        }
                        if (location.selector) {
                            // it's a jQuery
                            context.next_engine = location.attr('data-engine');
                            if (options.clone === false) {
                                return location.remove()[0].innerHTML.toString();
                            } else {
                                return location[0].innerHTML.toString();
                            }
                        }
                    }
                });
            },

            loadPartials: function (partials) {
                /// <summary>
                /// Load partials
                /// </summary>
                /// <param name="partials" type="String">
                ///     Partials
                /// </param>

                var name;
                if (partials) {
                    this.partials = this.partials || {};
                    for (name in partials) {
                        (function (context, name) {
                            context.load(partials[name])
                                .then(function (template) {
                                    this.partials[name] = template;
                                });
                        })(this, name);
                    }
                }
                return this;
            },

            render: function (location, data, callback, partials) {
                /// <summary>
                /// `load()` a template and then `interpolate()` it with data.
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="callback" type="Function">
                ///     Cllback function
                /// </param>
                /// <param name="partials" type="String">
                ///     Partials
                /// </param>

                if (_isFunction(location) && !data) {
                    // invoked as render(callback)
                    return this.then(location);
                } else {
                    if (_isFunction(data)) {
                        // invoked as render(location, callback, [partials])
                        partials = callback;
                        callback = data;
                        data = null;
                    } else if (callback && !_isFunction(callback)) {
                        // invoked as render(location, data, partials)
                        partials = callback;
                        callback = null;
                    }

                    return this.loadPartials(partials)
                        .load(location)
                        .interpolate(data, location)
                        .then(callback);
                }
            },

            partial: function (location, data, callback, partials) {
                /// <summary>
                /// `render()` the `location` with `data` and then `swap()` the
                /// app's `$element` with the rendered content.
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <param name="partials" type="String">
                ///     Partials
                /// </param>

                if (_isFunction(callback)) {
                    // invoked as partial(location, data, callback, [partials])
                    return this.render(location, data, partials).swap(callback);
                } else if (_isFunction(data)) {
                    // invoked as partial(location, callback, [partials])
                    return this.render(location, {}, callback).swap(data);
                } else {
                    // invoked as partial(location, data, [partials])
                    return this.render(location, data, callback).swap();
                }
            },

            send: function () {
                /// <summary>
                /// defers the call of function to occur in order of the render queue.
                /// The function can accept any number of arguments as long as the last
                /// argument is a callback function. This is useful for putting arbitrary
                /// asynchronous functions into the queue. The content passed to the
                /// callback is passed as `content` to the next item in the queue.
                /// </summary>
                /// <param name="arguments" type="Array">
                ///     Arguments
                /// </param>

                var context = this,
                    args = _makeArray(arguments),
                    fun = args.shift();

                if (_isArray(args[0])) {
                    args = args[0];
                }

                return this.then(function (content) {
                    args.push(function (response) { context.next(response); });
                    context.wait();
                    fun.apply(fun, args);
                    return false;
                });
            },

            collect: function (array, callback, now) {
                /// <summary>
                /// iterates over an array, applying the callback for each item item. the
                /// callback takes the same style of arguments as `jQuery.each()` (index, item).
                /// The return value of each callback is collected as a single string and stored
                /// as `content` to be used in the next iteration of the `RenderContext`.
                /// </summary>
                /// <param name="array" type="Array">
                ///     Array
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <param name="now" type="Object">
                ///     Object
                /// </param>

                var context = this;
                var coll = function () {
                    if (_isFunction(array)) {
                        callback = array;
                        array = this.content;
                    }
                    var contents = [], doms = false;
                    $.each(array, function (i, item) {
                        var returned = callback.apply(context, [i, item]);
                        if (returned.jquery && returned.length == 1) {
                            returned = returned[0];
                            doms = true;
                        }
                        contents.push(returned);
                        return returned;
                    });
                    return doms ? contents : contents.join('');
                };
                return now ? coll() : this.then(coll);
            },

            renderEach: function (location, name, data, callback) {
                /// <summary>
                /// loads a template, and then interpolates it for each item in the `data`
                /// array. If a callback is passed, it will call the callback with each
                /// item in the array _after_ interpolation
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="name" type="String">
                ///     Name
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>

                if (_isArray(name)) {
                    callback = data;
                    data = name;
                    name = null;
                }
                return this.load(location).then(function (content) {
                    var rctx = this;
                    if (!data) {
                        data = _isArray(this.previous_content) ? this.previous_content : [];
                    }
                    if (callback) {
                        $.each(data, function (i, value) {
                            var idata = {}, engine = this.next_engine || location;
                            name ? (idata[name] = value) : (idata = value);
                            callback(value, rctx.event_context.interpolate(content, idata, engine));
                        });
                    } else {
                        return this.collect(data, function (i, value) {
                            var idata = {}, engine = this.next_engine || location;
                            name ? (idata[name] = value) : (idata = value);
                            return this.event_context.interpolate(content, idata, engine);
                        }, true);
                    }
                });
            },

            interpolate: function (data, engine, retain) {
                /// <summary>
                /// uses the previous loaded `content` and the `data` object to interpolate
                /// a template. `engine` defines the templating/interpolation method/engine
                /// that should be used. If `engine` is not passed, the `next_engine` is
                /// used. If `retain` is `true`, the final interpolated data is appended to
                /// the `previous_content` instead of just replacing it.
                /// </summary>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="engine" type="Object">
                ///     Engine
                /// </param>
                /// <param name="retain" type="Boolean">
                ///     Retain
                /// </param>

                var context = this;
                return this.then(function (content, prev) {
                    if (!data && prev) {
                        data = prev;
                    }
                    if (this.next_engine) {
                        engine = this.next_engine;
                        this.next_engine = false;
                    }
                    var rendered = context.event_context.interpolate(content, data, engine, this.partials);
                    return retain ? prev + rendered : rendered;
                });
            },

            swap: function (callback) {
                /// <summary>
                /// Swap the return contents ensuring order. See `Application#swap`
                /// </summary>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>

                return this.then(function (content) {
                    this.event_context.swap(content, callback);
                    return content;
                }).trigger('changed', {});
            },

            appendTo: function (selector) {
                /// <summary>
                /// Same usage as `jQuery.fn.appendTo()` but uses `then()` to ensure order
                /// </summary>
                /// <param name="selector" type="String">
                ///     Selector
                /// </param>

                return this.then(function (content) {
                    $(selector).append(content);
                }).trigger('changed', {});
            },

            prependTo: function (selector) {
                /// <summary>
                /// Same usage as `jQuery.fn.prependTo()` but uses `then()` to ensure order
                /// </summary>
                /// <param name="selector" type="String">
                ///     Selector
                /// </param>

                return this.then(function (content) {
                    $(selector).prepend(content);
                }).trigger('changed', {});
            },

            replace: function (selector) {
                /// <summary>
                /// Replaces the `$(selector)` using `html()` with the previously loaded
                /// `content`
                /// </summary>
                /// <param name="selector" type="String">
                ///     Selector
                /// </param>

                return this.then(function (content) {
                    $(selector).html(content);
                }).trigger('changed', {});
            },

            trigger: function (name, data) {
                /// <summary>
                /// trigger the event in the order of the event context. Same semantics
                /// as `Sammy.EventContext#trigger()`. If data is omitted, `content`
                /// is sent as `{content: content}`
                /// </summary>
                /// <param name="name" type="String">
                ///     Name
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>

                return this.then(function (content) {
                    if (typeof data == 'undefined') {
                        data = { content: content };
                    }
                    this.event_context.trigger(name, data);
                    return content;
                });
            }
        });

        Sammy.EventContext = function (app, verb, path, params, target) {
            /// <summary>
            /// `Sammy.EventContext` objects are created every time a route is run or a
            /// bound event is triggered. The callbacks for these events are evaluated within a `Sammy.EventContext`
            /// This within these callbacks the special methods of `EventContext` are available.
            /// </summary>
            /// <param name="app" type="Sammy.Application">
            ///     The `Sammy.Application` this event is called within
            /// </param>
            /// <param name="verb" type="String">
            ///     The verb invoked to run this context/route
            /// </param>
            /// <param name="path" type="String">
            ///     The string path invoked to run this context/route
            /// </param>
            /// <param name="params" type="Object">
            ///     An Object of optional params to pass to the context. Is converted
            ///   to a `Sammy.Object`.
            /// </param>
            /// <param name="params" type="Object">
            ///     `target` a DOM element that the event that holds this context originates
            ///   from. For post, put and del routes, this is the form element that triggered
            ///   the route.
            /// </param>

            this.app = app;
            this.verb = verb;
            this.path = path;
            this.params = new Sammy.Object(params);
            this.target = target;
        };

        Sammy.EventContext.prototype = $.extend({}, Sammy.Object.prototype, {
            $element: function () {
                /// <summary>
                /// A shortcut to the app's `$element()`
                /// </summary>
                /// <returns type="jQuery" />

                return this.app.$element(_makeArray(arguments).shift());
            },

            engineFor: function (engine) {
                /// <summary>
                /// Look up a templating engine within the current app and context.
                /// `engine` can be one of the following:
                ///
                /// * a function: should conform to `function(content, data) { return interpolated; }`
                /// * a template path: 'template.ejs', looks up the extension to match to
                ///   the `ejs()` helper
                /// * a string referring to the helper: "mustache" => `mustache()`
                ///
                /// If no engine is found, use the app's default `template_engine`
                /// </summary>
                /// <param name="engine" type="String">
                ///     Engine
                /// </param>

                var context = this, engine_match;
                // if path is actually an engine function just return it
                if (_isFunction(engine)) {
                    return engine;
                }
                // lookup engine name by path extension
                engine = (engine || context.app.template_engine).toString();
                if ((engine_match = engine.match(/\.([^\.\?\#]+)$/))) {
                    engine = engine_match[1];
                }
                // set the engine to the default template engine if no match is found
                if (engine && _isFunction(context[engine])) {
                    return context[engine];
                }

                if (context.app.template_engine) {
                    return this.engineFor(context.app.template_engine);
                }
                return function (content, data) { return content; };
            },

            interpolate: function (content, data, engine, partials) {
                /// <summary>
                /// using the template `engine` found with `engineFor()`, interpolate the
                /// `data` into `content`
                /// </summary>
                /// <param name="content" type="Object">
                ///     Content
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="engine" type="String">
                ///     Engine
                /// </param>
                /// <param name="partials" type="Object">
                ///     Partials
                /// </param>

                return this.engineFor(engine).apply(this, [content, data, partials]);
            },

            render: function (location, data, callback, partials) {
                /// <summary>
                /// Create and return a `Sammy.RenderContext` calling `render()` on it.
                /// Loads the template and interpolate the data, however does not actual
                /// place it in the DOM.
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <param name="partials" type="Object">
                ///     Partials
                /// </param>

                return new Sammy.RenderContext(this).render(location, data, callback, partials);
            },

            renderEach: function (location, name, data, callback) {
                /// <summary>
                /// Create and return a `Sammy.RenderContext` calling `renderEach()` on it.
                /// Loads the template and interpolates the data for each item,
                /// however does not actual place it in the DOM.
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="name" type="String">
                ///     Name
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>

                return new Sammy.RenderContext(this).renderEach(location, name, data, callback);
            },

            load: function (location, options, callback) {
                /// <summary>
                /// create a new `Sammy.RenderContext` calling `load()` with `location` and
                /// `options`. Called without interpolation or placement, this allows for
                /// preloading/caching the templates.
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="options" type="Object">
                ///     Options
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>

                return new Sammy.RenderContext(this).load(location, options, callback);
            },

            partial: function (location, data, callback, partials) {
                /// <summary>
                /// `render()` the `location` with `data` and then `swap()` the
                /// app's `$element` with the rendered content.
                /// </summary>
                /// <param name="location" type="String">
                ///     Location
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>
                /// <param name="partials" type="Object">
                ///     Partials
                /// </param>

                return new Sammy.RenderContext(this).partial(location, data, callback, partials);
            },

            send: function () {
                /// <summary>
                /// create a new `Sammy.RenderContext` calling `send()` with an arbitrary
                /// function
                /// </summary>

                var rctx = new Sammy.RenderContext(this);
                return rctx.send.apply(rctx, arguments);
            },

            redirect: function () {
                /// <summary>
                /// Changes the location of the current window. If `to` begins with
                /// '#' it only changes the document's hash. If passed more than 1 argument
                /// redirect will join them together with forward slashes.
                /// </summary>

                var to, args = _makeArray(arguments),
                    current_location = this.app.getLocation(),
                    l = args.length;
                if (l > 1) {
                    var i = 0, paths = [], pairs = [], params = {}, has_params = false;
                    for (; i < l; i++) {
                        if (typeof args[i] == 'string') {
                            paths.push(args[i]);
                        } else {
                            $.extend(params, args[i]);
                            has_params = true;
                        }
                    }
                    to = paths.join('/');
                    if (has_params) {
                        for (var k in params) {
                            pairs.push(this.app._encodeFormPair(k, params[k]));
                        }
                        to += '?' + pairs.join('&');
                    }
                } else {
                    to = args[0];
                }
                this.trigger('redirect', { to: to });
                this.app.last_location = [this.verb, this.path];
                this.app.setLocation(to);
                if (new RegExp(to).test(current_location)) {
                    this.app.trigger('location-changed');
                }
            },

            trigger: function (name, data) {
                /// <summary>
                /// Triggers events on `app` within the current context.
                /// </summary>
                /// <param name="name" type="String">
                ///     Location
                /// </param>
                /// <param name="data" type="Object">
                ///     Data
                /// </param>

                if (typeof data == 'undefined') {
                    data = {};
                }
                if (!data.context) {
                    data.context = this;
                }
                return this.app.trigger(name, data);
            },

            eventNamespace: function () {
                /// <summary>
                /// A shortcut to app's `eventNamespace()`
                /// </summary>

                return this.app.eventNamespace();
            },

            swap: function (contents, callback) {
                /// <summary>
                /// A shortcut to app's `swap()`
                /// </summary>
                /// <param name="contents" type="Object">
                ///     Contents
                /// </param>
                /// <param name="callback" type="Function">
                ///     Callback function
                /// </param>

                return this.app.swap(contents, callback);
            },

            notFound: function () {
                /// <summary>
                /// Raises a possible `notFound()` error for the current path.
                /// </summary>

                return this.app.notFound(this.verb, this.path);
            },

            json: function (string) {
                /// <summary>
                /// Default JSON parsing uses jQuery's `parseJSON()`. Include `Sammy.JSON`
                /// plugin for the more conformant "crockford special".
                /// </summary>
                /// <param name="string" type="String">
                ///     String
                /// </param>

                return $.parseJSON(string);
            },

            toString: function () {
                /// <summary>
                /// //=> Sammy.EventContext: get #/ {}
                /// </summary>
                /// <returns type="String" />

                return "Sammy.EventContext: " + [this.verb, this.path, this.params].join(' ');
            }
        });

        return Sammy;
    });
})(jQuery, window);
