define(function(require) {
    var isDebugging = false,
        nativeKeys = Object.keys,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        system,
        treatAsIE8 = false;

    //see http://patik.com/blog/complete-cross-browser-console-log/
    // Tell IE9 to use its built-in console
    if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
        try {
            ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
                .forEach(function(method) {
                    console[method] = this.call(console[method], console);
                }, Function.prototype.bind);
        } catch (ex) {
            treatAsIE8 = true;
        }
    }

    requirejs.onResourceLoad = function(context, map, depArray) {
        system.setModuleId(context.defined[map.id], map.id);
    };

    var noop = function() { };

    var log = function() {
        try {
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
            else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.log == 'object') {
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
            }

            // IE7 and lower, and other old browsers
        } catch(ignore) {}
    };

    system = {
        version:"1.1.1",
        noop: noop,
        getModuleId: function(obj) {
            if (!obj) {
                return null;
            }
            
            if (typeof obj == 'function') {
                return obj.prototype.__moduleId__;
            }

            if (typeof obj == 'string') {
                return null;
            }

            return obj.__moduleId__;
        },
        setModuleId: function (obj, id) {
            if (!obj) {
                return;
            }

            if (typeof obj == 'function') {
                obj.prototype.__moduleId__ = id;
                return;
            }

            if (typeof obj == 'string') {
                return;
            }

            obj.__moduleId__ = id;
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