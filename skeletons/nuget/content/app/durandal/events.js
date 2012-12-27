//heavily borrowed from backbone events, augmented by signals.js, added a little of my own code, cleaned up for better readability
define(function(require) {
    var system = require('./system');
    var eventSplitter = /\s+/;
    var Events = function() { };

    var Subscription = function(owner, events) {
        this.owner = owner;
        this.events = events;
    };

    Subscription.prototype.then = function(callback, context) {
        if (!callback) {
            return this;
        }

        var calls = this.owner.callbacks || (this.owner.callbacks = {});
        var events = this.events, list;

        for (var i = 0; i < events.length; i++) {
            var current = events[i];

            list = calls[current] || (calls[current] = []);
            list.push(callback, context);
        }

        return this;
    };

    Events.prototype.on = function(events, callback, context) {
        var calls, event, list;
        events = events.split(eventSplitter);

        if (!callback) {
            return new Subscription(this, events);
        } else {
            calls = this.callbacks || (this.callbacks = {});

            while (event = events.shift()) {
                list = calls[event] || (calls[event] = []);
                list.push(callback, context);
            }

            return this;
        }
    };

    Events.prototype.off = function(events, callback, context) {
        var event, calls, list, i;

        // No events
        if (!(calls = this.callbacks)) {
            return this;
        }

        //removing all
        if (!(events || callback || context)) {
            delete this.callbacks;
            return this;
        }

        events = events ? events.split(eventSplitter) : system.keys(calls);

        // Loop through the callback list, splicing where appropriate.
        while (event = events.shift()) {
            if (!(list = calls[event]) || !(callback || context)) {
                delete calls[event];
                continue;
            }

            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }

        return this;
    };

    Events.prototype.trigger = function(events) {
        var event, calls, list, i, length, args, all, rest;
        if (!(calls = this.callbacks)) {
            return this;
        }

        rest = [];
        events = events.split(eventSplitter);
        for (i = 1, length = arguments.length; i < length; i++) {
            rest[i - 1] = arguments[i];
        }

        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {
            // Copy callback lists to prevent modification.
            if (all = calls.all) {
                all = all.slice();
            }

            if (list = calls[event]) {
                list = list.slice();
            }

            // Execute event callbacks.
            if (list) {
                for (i = 0, length = list.length; i < length; i += 2) {
                    list[i].apply(list[i + 1] || this, rest);
                }
            }

            // Execute "all" callbacks.
            if (all) {
                args = [event].concat(rest);
                for (i = 0, length = all.length; i < length; i += 2) {
                    all[i].apply(all[i + 1] || this, args);
                }
            }
        }

        return this;
    };

    Events.prototype.proxy = function(events) {
        var that = this;
        return (function(arg) {
            that.trigger(events, arg);
        });
    };

    Events.includeIn = function(targetObject) {
        targetObject.on = Events.prototype.on;
        targetObject.off = Events.prototype.off;
        targetObject.trigger = Events.prototype.trigger;
        targetObject.proxy = Events.prototype.proxy;
    };

    return Events;
});