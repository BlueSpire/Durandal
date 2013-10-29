---
title: Docs - Leveraging Publish and Subscribe
layout: docs
tags: ['docs','pub-sub','how to']
---
# Leveraging Publish and Subscribe
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
        Use <code>Events.includeIn(obj);</code> to add events into any object.
    </li>
    <li>
        Events have been added to the <em>app</em> module by default, to support app-wide messaging.
    </li>
    <li>
        Use <code>trigger(eventList, payload)</code> to publish a message.
    </li>
    <li>
        Use <code>on(eventList).then(...)</code> to subscribe to a message.
    </li>
  </ul>
</blockquote>

### Adding Events to An Object

You can add events to any object by using the _events_ module. Here's how you would do it:

```javascript
var Events = require('durandal/events');
var myObj = { ... };
Events.includeIn(myObj);
```

By doing this, _myObj_ gains the following functions:

* `on` - Subscribe to this object's events.
* `off` - Un-subscribe to this object's events.
* `trigger` - Trigger this object's events.
* `proxy` - Proxy this object's events.

You can see the [events](/documentation/api#module/events) module reference documentation for more detailed information on these.
Some examples of using the _app_ module's events are demonstrated below.

>**Note:** The _eventList_ that is passed to the functions above can be a list of events to publish or subscribe to. Whitespace is used to delimit events.

### Using Application-Wide Messaging

By default, the _app_ module has already had the events capability added to it. 
This sets you up to do application-wide messaging out-of-the-box. In light of that, here are a few simple use cases:

**Publishing an app-wide message.**
```javascript
app.trigger('customer:new', newCustomer);
```

**Subscribing to an app-wide message.**
```javascript
app.on('customer:new').then(function(customer){
  //do something with the payload
});
```

**Un-subscribing from an app-wide message.**
```javascript
var subscription = app.on('customer:new').then(function(customer){
  //do something with the payload
});

...

subscription.off();
```