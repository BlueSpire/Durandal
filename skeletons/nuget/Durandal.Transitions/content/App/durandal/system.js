define(function(require) {
    var isDebugging = false,
        nativeKeys = Object.keys,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        system;

    //see http://patik.com/blog/complete-cross-browser-console-log/
    // Tell IE9 to use its built-in console
    if (Array.prototype.forEach && Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
        ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
            .forEach(function(method) {
                console[method] = this.call(console[method], console);
            }, Function.prototype.bind);
    }

    requirejs.onResourceLoad = function(context, map, depArray) {
        var module = context.defined[map.id];
        if (!module) {
            return;
        }

        if (typeof module == 'function') {
            module.prototype.__moduleId__ = map.id;
            return;
        }

        if (typeof module == 'string') {
            return;
        }

        module.__moduleId__ = map.id;
    };

    var noop = function() {};

    var log = function() {
        // Modern browsers
        if (typeof console != 'undefined' && typeof console.log == 'function') {
            // Opera 11
            if (window.opera) {
                var i = 0;
                while (i < arguments.length) {
                    console.log('Item ' + (i + 1) + ': ' + arguments[i]);
                    i++;
                }
            }
                // All other modern browsers
            else if ((Array.prototype.slice.call(arguments)).length == 1 && typeof Array.prototype.slice.call(arguments)[0] == 'string') {
                console.log((Array.prototype.slice.call(arguments)).toString());
            } else {
                console.log(Array.prototype.slice.call(arguments));
            }

        }
            // IE8
        else if (!Function.prototype.bind && typeof console != 'undefined' && typeof console.log == 'object') {
            Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
        }
            // IE7 and lower, and other old browsers
        else {
            // Inject Firebug lite
            if (!document.getElementById('firebug-lite')) {
                // Include the script
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.id = 'firebug-lite';
                // If you run the script locally, point to /path/to/firebug-lite/build/firebug-lite.js
                script.src = 'https://getfirebug.com/firebug-lite.js';
                // If you want to expand the console window by default, uncomment this line
                //document.getElementsByTagName('HTML')[0].setAttribute('debug','true');
                document.getElementsByTagName('HEAD')[0].appendChild(script);
                setTimeout(function() { system.log(Array.prototype.slice.call(arguments)); }, 2000);
            } else {
                // FBL was included but it hasn't finished loading yet, so try again momentarily
                setTimeout(function() { system.log(Array.prototype.slice.call(arguments)); }, 500);
            }
        }
    };

    system = {
        noop: noop,
        getModuleId: function(obj) {
            if (!obj) {
                return null;
            }

            return obj.__moduleId__;
        },
        debug: function(enable) {
            if (arguments.length == 1) {
                isDebugging = enable;
                if (isDebugging) {
                    this.log = log;
                    this.log('Debug mode enabled.');
                } else {
                    this.log('Debug mode disabled.');
                    this.log = noop;
                }
            } else {
                return isDebugging;
            }
        },
        isArray: function(obj) {
            return toString.call(obj) === '[object Array]';
        },
        log: noop,
        defer: function(action) {
            return $.Deferred(action);
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        acquire: function() {
            var modules = Array.prototype.slice.call(arguments, 0);
            return this.defer(function(dfd) {
                require(modules, function() {
                    var args = arguments;
                    setTimeout(function() {
                        dfd.resolve.apply(dfd, args);
                    }, 1);
                });
            }).promise();
        }
    };

    system.keys = nativeKeys || function(obj) {
        if (obj !== Object(obj)) {
            throw new TypeError('Invalid object');
        }

        var keys = [];

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                keys[keys.length] = key;
            }
        }

        return keys;
    };

    return system;
});