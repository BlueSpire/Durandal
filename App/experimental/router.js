define(function (require) {
    function result() {}
    function keys(){}
    function isRegExp() {}
    function isFunction() {}
    function map() {}

    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    function routeToRegExp(route) {
        route = route.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
                return optional ? match : '([^\/]+)';
            })
            .replace(splatParam, '(.*?)');

        return new RegExp('^' + route + '$');
    }

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    function extractParameters(route, fragment) {
        var params = route.exec(fragment).slice(1);
        return map(params, function (param) {
            return param ? decodeURIComponent(param) : null;
        });
    }

    // Routers map faux-URLs to actions, and fire events when routes are
    // matched. Creating a new one sets its `routes` hash, if not set statically.
    var Router = function(options) {
        options || (options = {});
        
        if (options.routes) {
            this.routes = options.routes;
        }

        // Bind all defined routes to history. We have to reverse the
        // order of the routes here to support behavior where the most general
        // routes can be defined at the bottom of the route map.
        
        if (!this.routes) {
            return;
        }

        this.routes = result(this, 'routes');
        var route, routes = keys(this.routes);

        while ((route = routes.pop()) != null) {
            this.route(route, this.routes[route]);
        }
    };
    
    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    Router.prototype.route = function(route, name, callback) {
        if (!isRegExp(route)) {
            route = routeToRegExp(route);
        }
        
        if (isFunction(name)) {
            callback = name;
            name = '';
        }
        
        if (!callback) {
            callback = this[name];
        }

        var router = this;

        Backbone.history.route(route, function(fragment) {
            var args = extractParameters(route, fragment);
            callback && callback.apply(router, args);
            router.trigger.apply(router, ['route:' + name].concat(args));
            router.trigger('route', name, args);
            Backbone.history.trigger('route', router, name, args);
        });

        return this;
    };
    
    // Simple proxy to `Backbone.history` to save a fragment into the history.
    Router.prototype.navigate = function (fragment, options) {
        Backbone.history.navigate(fragment, options);
        return this;
    };
});