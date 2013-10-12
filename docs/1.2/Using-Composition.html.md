---
title: Docs - Using Composition
layout: docs
tags: ['docs','composition','how to']
---
# Using Composition
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
      While modules enable the developer to break a complex app into several simple parts, composition enables them to be stitched back together.
    </li>
    <li>
      There are two types of composition in Durandal: Object Composition and Visual Composition.
    </li>
    <li>
      Use the <em>compose</em> binding to achieve Visual Composition.
    </li>
    <li>
      Combine <em>observables</em> with the <em>compose</em> binding to achieve dynamically changing composition.
    </li>
  </ul>
</blockquote>

### Object Composition

If you have read the section on modules, you are already familiar with object composition.
For example, if you have two modules: _A_ and _B_. If module _B_ _requires_ module _A_, then you have used a very basic form of object composition.
This is nothing unique to Durandal, but is provided entirely by the AMD mechanism via RequireJS.
By leveraging object and function modules with declarative module dependencies, you can implement object modularization and composition in a way that will help you to easily solve some very complex problems.

### Visual Composition

Visual compositon allows you to break down your views into re-usable components and to connect them with their composed, object counterparts.
This functionality is a central and unique feature of Durandal and is provided by the [Composition Module](/documentation/Composition).
While you can use the composition module directly to achieve this in code, the most common way of leveraging it will be through the _compose binding_.
If you create widgets or use modal dialogs, you will also be leveraging it indirectly. In fact, everything you see presented in the browser's view is run through Durandal's composition pipeline.

Let's see how composition works, by first looking at app startup. Here's some code from a stripped down _main.js_ file:

```javascript
define(function(require) {
    var app = require('durandal/app');

    app.start().then(function () {
        app.adaptToDevice();
        app.setRoot('shell', 'entrance');
    });
});
```

Notice the call to _setRoot_. This actually invokes the composition engine. What is the result?

1. RequireJS is used to find the module with id _shell_ (shell.js on the file system).
2. The view locator is used to locate the appropriate view for _shell_. The defult configuration will find _shell.html_.
3. The view engine is used to create the view from the markup in _shell.html_.
4. The _shell_ module and the _shell_ view are data-bound together using Knockout.
5. The bound _shell_ view is inserted into the DOM (in the default _applicationHost_ div).
6. The 'entrance' transition is used to animate the view in.

The result is that your application's shell (main layout/window/etc) is visually composed into the document.
Now lets take a look at how we can do some basic visual composition inside of the shell view. Have a look at this markup:

```html
<div>
    <div data-bind="compose:'views/header.html'"></div>
</div>
```

Here we are using the _compose_ binding to inject a view. The composition system will locate 'views/header.html' and inject it into the DOM inside the div.
The header html view will be data-bound against the existing context (the shell module) since it's an explicit view composition, without a module.
So, how do we specify that header actually has it's own view and module? Like this:

```html
<div>
    <div data-bind="compose:'viewmodels/header'"></div>
</div>
```

When there is no view extension (according to the view engine) then the composition engine interprets this as a module Id.
In this case, it will require the 'viewmodels/header' module and then locate it's view (according to convention).
The module and the view will be bound and the view will be injected into the div.

This is all fine for construction of static components, but what about dynamic composition?
Well, the compose binding can take an observable, like so:

```html
<div>
    <div data-bind="compose:activeScreen"></div>
</div>
```

Imagine that your shell module looks like this:

```javascript
define(function(require) {
    return {
        activeScreen:ko.observable()
    };
});
```

Now, the compose binding queries the observable for its value. Here's a few things that could happen, depending on the value of the observable:

* If it's a string value:
    * If it has a view extension:
        * Locate the view and inject it into the dom, binding against the current context.
    * If it is a module id:
        * Locate the module, locate its view, bind them and inject them into the DOM.
* If it's an object:
    * Locate its view, bind it and inject them into the DOM.
* If it's a function:
    * Call the function with the _new_ modifier, get its return value, find the view for the return value, bind them and inject them into the DOM.

The important thing to remember in this case is that this is an _observable_. So any time your _activeScreen_ property changes, the composition engine will re-compose that part of the DOM.
This enables extremely powerful dynamic, changing composition of any part of the dom simply through data-binding. 
There's lots more the composition engine can do. To dig in deeper have a look at the [reference documentation](/documentation/Composition) and study the sample and starter kit.