define(function(require) {
    var system = require('durandal/system');

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
        initialize: function(activator, defaultRoute) {
            function activateRoute(route) {
                var parts = route.split('/');
                var controllerId = parts[0];
                var params = parts.splice(1);

                system.acquire('controllers/' + controllerId).then(function(Controller) {
                    var instance = construct(Controller, params);
                    activator(instance);
                });
            }

            Sammy(function(route) {
                route.get('', function() {
                    var fragment = this.path.split('#/');
                    if (fragment.length == 2) {
                        activateRoute(fragment[1]);
                    } else {
                        activateRoute(defaultRoute);
                    }
                });
            }).run();
        }
    };
});