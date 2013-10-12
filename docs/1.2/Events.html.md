---
title: Docs - Events
layout: docs
tags: ['docs','events','reference']
---
# Events
#### 

> Durandal events originate from backbone.js but also combine some ideas from signals.js as well as some additional improvements. 

Events can be added to any object. By default they are added to the _app module_ for use as an application-wide event aggregator. Every object that has events installed has the following functions:

* `function on(events, callback, context)` - The _events_ parameter is a space delimited string containing one or more event identifiers. When one of these events is triggered, the callback is called and passed the event data provided by the trigger. The special events value of "all" binds all events on the object to the callback. If a _context_ is provided, it will be bound to _this_ for the callback. If the _callback_ is omitted, then a promise-like object is returned from _on_. This object represents a subscription and has a _then_ function used to register callbacks.

* `function off(events, callback, context)` - Unwires callbacks from events. If no context is specified, all callbacks with different contexts will be removed. If no callback is specified, all callbacks for the event will be removed. If no event is specified, all event callbacks on the object will be removed.

* `function trigger(events, args...)` - Triggers an event, or space-delimited list of events. Subsequent arguments to trigger will be passed along to the event callbacks.

* `function proxy(events)` - Provides a function which can be used as a callback to trigger the events. This is useful in combination with jQuery events which may need to trigger the aggregator's events.

You can install events into any object by invoking the _events module_ function `includeIn(targetObject)`. The _events module_ can also be invoked itself with _new_ in order to create a new event aggregator.