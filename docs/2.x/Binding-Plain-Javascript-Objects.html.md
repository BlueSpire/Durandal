---
title: Docs - Binding Plain Javascript Objects
layout: docs
tags: ['docs']
---
# Binding Plain Javascript Objects
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>Install the [observable plugin](/documentation/api#module/observable) to databind to plain JavaScript objects without needing Knockout observables in your model.</li>
    <li>The observable plugin only works with ES5 compatible browsers.</li>
    <li>The plugin simplifies working with promised data.</li>
  </ul>
</blockquote>

### Configuration

Durandal's [observable plugin](/documentation/api#module/observable) can hook into the [binder](/documentation/api#module/binder) and ensure that all bound objects are observable. Let's see how to install the plugin. In your _main.js_ file, before calling [app.start()](/documentation/api#module/app/method/start) you will need to make a call to [configurePlugins(...)](/documentation/api#module/app/method/configurePlugins). Here's what your code might look like:

```javascript
define(['durandal/app'],  function (app) {
    app.configurePlugins({
        observable: true
    });

    app.start().then(function () {
        app.setRoot('shell');
    });
});
```

Once you've done that, you have enabled two-way databinding against plain JavaScript objects. You can still use Knockout observables, but they are not necessary.

### Usage Scenarios

The observable plugin provides amazing simplifcation, readability and maintainability to your code. But, you must only use it when targeting an ES5 browser with `defineProperty` support. It will not work without this crucial JavaScript language capability. Supported browsers include:

* &gt;= IE9
* &gt;= Firefox 4
* &gt;= Safari 5
* &gt;= Opera 12
* &gt;= Chrome 5
* WebKit-Based Browers

Once you configure the plugin, all bound objects are observable, even though they have normal properties. There are a couple of interesting scenarios to cover as a result of this change.

#### Accessing the Underlying Observable

Even though your objects have normal properties, they are actually implemented using ES5 getters and setters. Underlying the property is an actual Knockout observable. Should you need to subscribe to such an observable (even if the plugin has not yet created the getters and setters) you would do it like this:

```javascript
var observable = require('plugins/observable');

var viewModel:{
	firstName:'',
	lastName:''
};

observable(viewModel, 'firstName').subscribe(function(value){
	console.log('First name changed.');
});

viewModel.firstName = 'Test';
```

Calling the observable module as a function, and passing the object and the property name, will return the underlying Knockout observable instance. This is also handy for extending observables or passing them around.

#### Creating Computed Observables

If you wish to create a computed observable, you can use the [observable.defineProperty](/documentation/api#module/observable/method/defineProperty) API like so:

```javascript
var observable = require('plugins/observable');

var viewModel:{
	firstName:'',
	lastName:''
};

observable.defineProperty(viewModel, 'fullName', function(){
	return this.firstName + ' ' + this.lastName;
});

console.log(viewModel.fullName);
```

The third argument to [observable.defineProperty](/documentation/api#module/observable/method/defineProperty) functions just like the argument to a Knockout computed.

### Promises

The observable module also understands promises. If you have an attribute that is an instance of a promise on your bound model, the observable module will convert this into a getter that returns the promised value. Under the covers it will register a callback with the promise and then update the observable for you. Here's an example of code you might write in light of this:

```javascript
define(function (require) {
    var server = require('services/server');

    return {
        activate: function () {
            this.activity = server.getRecentActivity(); //async action returns a promise
            this.news = server.getNews(); //async action returns a promise
        }
    };
});
```
In your view, you can data-bind to these as if they were normal arrays.

```html
<div data-bind="foreach: news">
    <h1 data-bind="text: title"></h1>
    <p data-bind="text: content"></p>
    <hr>
</div>
```