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
        navigation:[],
        mapRoute: function (url, moduleId, mainNavName) {
            var routeInfo = {
                url:url,
                moduleId: moduleId,
                name: mainNavName
            };

            routes[url] = routeInfo;

            if (mainNavName) {
                this.navigation.push(routeInfo);
            }
        },
        enable: function (activator, defaultRoute) {
            function activateRoute(route) {
                var parts = route.split('/');
                var lookup = parts[0];
                var params = parts.splice(1);

                system.acquire(routes[lookup].moduleId).then(function(module) {
                    if (typeof module == "function") {
                        activator(construct(module, params));
                    } else {
                        activator(module);
                    }
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