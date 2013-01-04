define(function (require) {
    var system = require('durandal/system');
    var routes = {};
    
    //NOTE: Sammy.js is not required by Durandal. This is just an example
    //of how you can use them together for navigation.

    function construct(ctor, args) {
        function F() {
            return ctor.apply(this, args);
        }
        F.prototype = ctor.prototype;
        return new F();
    }

    return {
        main:[],
        addRoute: function (route, moduleId, mainNavName) {
            var routeInfo = {
                route:route,
                moduleId: moduleId,
                mainNavName: mainNavName
            };

            routes[route] = routeInfo;

            if (mainNavName) {
                this.main.push(routeInfo);
            }
        },
        start: function (activator, defaultRoute) {
            function activateRoute(route) {
                var parts = route.split('/');
                var lookup = parts[0];
                var params = parts.splice(1);

                system.acquire(routes[lookup].moduleId).then(function (controller) {
                    var instance = construct(controller, params);
                    activator(instance);
                });
            }

            var app = Sammy(function (route) {
                route.get('', function() {
                    var fragment = this.path.split('#/');
                    if (fragment.length == 2) {
                        activateRoute(fragment[1]);
                    } else {
                        activateRoute(defaultRoute);
                    }
                });
            });

            app._checkFormSubmission = function () {
                return false;
            };

            app.run();
        }
    };
});