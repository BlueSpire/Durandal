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
    <li>
      Leverage the various compositon settings to enhance the flexibility and reusability of your components.
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
This functionality is a central and unique feature of Durandal and is provided by the [Composition Module](/documentation/api#module/composition).
While you can use the composition module directly to achieve this in code, the most common way of leveraging it will be through the _compose binding_.
If you create widgets or use modal dialogs, you will also be leveraging it indirectly. In fact, everything you see presented in the browser's view is run through Durandal's composition pipeline.

Let's see how composition works, by first looking at app startup. Here's some code from a stripped down _main.js_ file:

```javascript
define(function(require) {
    var app = require('durandal/app');

    app.start().then(function () {
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
So, how do we specify that header actually has its own view and module? Like this:

```html
<div>
    <div data-bind="compose:'viewmodels/header'"></div>
</div>
```

When there is no view extension (according to the view engine) then the composition engine interprets this as a module Id.
In this case, it will require the 'viewmodels/header' module and then locate its view (according to convention).
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
This enables extremely powerful dynamic, changing composition of any part of the DOM simply through data-binding. 

That's just a quick summary though. There's lots more the composition engine can do. Let's look broadly at the various configurations:

#### Composing a String Value
If the compose binding resolves to a string, it is assumed to be an identifier either for a module or for a view. If the string ends in an extension recognized by the view engine, then the [viewLocator module](/documentation/api#module/viewLocator) is used by invoking its [locateView](/documentation/api#module/viewLocator/method/locateView) function, which returns the identified view partial, actualized as a DOM fragment. The [binder module](/documentation/api#module/binder) is then used to bind that view to the _bindingContext_ and it is injected into the element that the _compose_ binding exists on. 

> **Note:** When no model is specified, the view is interpreted to be a partial view. In this case, the infrastructure sets the _area_ to 'partial'. See _Areas_ below for more information.

If it is not recognized by the [viewLocator](/documentation/api#module/viewLocator), then it is assumed to be a module id. RequireJS is then used to require the module. Once this is done, the [viewLocator](/documentation/api#module/viewLocator) is used to locate the conventional view for the module, the [binder](/documentation/api#module/binder) is used to bind them, and it is injected into the element.

> **Note:** If the module that is resolved by RequireJS is a function, rather than an abject, the function will be invoked with the _new_ modifier.

**Binding Examples**

1. `data-bind="compose: 'myView.html'"` - Locates the view, realizes it, binds it to the parent binding context and composes it into the DOM node on which the binding is declared.

2. `data-bind="compose: 'shell'"` - Uses RequireJS to get the _shell module_, locates the view conventionally, binds it and injects it into the DOM node on which the binding is declared.

3. `data-bind="compose: someProperty"` - Evaluates the binding to obtain the result of _someProperty_. If it is a string, follows the rules specified above to complete the composition with the bound view being injected on the dom node that declares this binding.

#### Composing an Object Instance
If this is the case, the [viewLocator](/documentation/api#module/viewLocator) is used to locate the the conventional view for the module, the [binder](/documentation/api#module/binder) is used to bind them, and it is injected into the specified _element_.

**Binding Examples**

1. `data-bind="compose: someProperty"` - Evaluates the binding to obtain the result of _someProperty_ which, if it is an object instance (and not a string), will follow the process above to finalize the composition process with the bound view being injected on the DOM node that declares this binding.

#### Composing Explicit Models and Views
If a _view_ property exists, but no _model_ property, the view will be resolved and bound to the _bindingContext_, then injected into the _element_. If a _model_ property exists, but no _view_ property, the [viewLocator](/documentation/api#module/viewLocator) will be used to locate the conventional view, they will be bound, then injected into the _element_. If both _model_ and _view_ properties exist, then they will be bound and injected into the _element_. Bear in mind, if the _model_ is a string, it will be assumed to be a module id and will be resolved with RequireJS. Likewise, if the _view_ is a string, it will be resoled with the [viewLocator](/documentation/api#module/viewLocator) before binding. Note: When a view is specified in this way, the view's file extension is not required.

**Binding Examples**

1. `data-bind="compose: { model:someModelProperty }"` - The value of _someModelProperty_ is used with the _viewLocator_ to obtain a view. They are then bound and the view is injected into the DOM node.

2. `data-bind="compose: { view:someViewProperty }"` - The value of _someViewProperty_ is evaluated. If it is a string, the _viewLocator_ is used to locate the view; otherwise it is assumed to be a view. The resultant view is injected into the DOM node.

3. `data-bind="compose: { model:someModelProperty, view:someViewProperty }"` - The value of _someModelProperty_ is resolved. The value of _someViewProperty_ is resolved and a view is constructed as indicated in 2. The two are then bound and injected into the DOM node.

4. `data-bind="compose: { model:someModelProperty, view:'myView.html' }"` - The value of _someModelProperty_ is resolved. The _viewLocator_ is then used to obtain the view indicated by _view_. They are then bound and the view is injected into the DOM node.

5. `data-bind="compose: { model:'shell', view:someViewProperty }"` - RequireJS is used to resolve the _shell module_. The value of _someViewProperty_ is resolved and a view is returned as described in 2. The view is then bound to the resolved module and injected into the DOM node.

6. `data-bind="compose: { model:'shell', view:'myView.html' }"` - RequireJS is used to resolve the _shell module_. The _viewLocator_ is then used to obtain the view indicated by _view_. The view is then bound to the resolved module and injected into the DOM node.

#### Using a Custom View Location Strategy
By default, if no view is specified, the [viewLocator](/documentation/api#module/viewLocator) is used to locate the conventional view for the specified _model_. However, settings can contain a _strategy_ property which specifies a custom function capable of resolving the view to be used instead. The signature of the function should be `function strategy(settings) : promise` The _settings_ parameter will contain all the composition configuration information, however, at this stage in the pipeline, the _model_ property will always be an object instance. Any strings will already have been resolved to modules. This allows your custom strategy to resolve the view based on the model instance and any other custom properties you may have previously declared on the settings object. The custom strategy function should return a promise which resolves the realized view as a dom fragment ready for binding and insertion into the dom. If the _strategy_ is a string, it is assumed to be a module id and RequireJS will be used to require the custom strategy.

**Binding Examples**

1. `data-bind="compose: { model:$data, strategy:'myCustomViewStrategy' }"` - Uses RequireJS to resolve a module with id of "myCustomViewStrategy". This strategy is then invoked for _$data_ to find the view. The resultant view is then bound to _$data_ and injected into the node on which the binding is declared.

#### Containerless Composition
The composition features presented here all work with Knockout's containerless comment syntax as well, so the following is valid: 

`<!-- ko compose: activeItem--><!--/ko-->`

### Additional Settings

#### Transition

When the composition mechanism switches nodes in and out of the DOM, it can use a _transition_. To specify a transition, add the _transition_ value to your compose binding. It should be set to a transition name. To create a custom transition, create a folder _transitions_ and place a module there named according to the transition identifier you wish to specify in your compose binding. The default Durandal starter templates use RequireJS to map the transitions into your durandal scripts folder. The transition module you create is a function module with a signature as follows `function (settings) : promise` _settings_ are all the resolved composition settings passed from the binding along with the _parent_ and _child_ nodes. You should return a promise from your transition that resolves when the transition is complete. You can set a default transition for all compositions by setting the composition module's [defaultTransitionName](/documentation/api#module/composition/property/defaultTransitionName) property.

> **Note:** Transitions are expected to be located in a _transitions_ folder under the durandal folder as stated above. However, you can easily change this conventional location. To do so either use RequireJS path configuration or override the compose module's [convertTransitionToModuleId](/documentation/api#module/composition/method/convertTransitionToModuleId) function.

> **Note:** Transitions will not be run if the previous view and the new view are the exact same instance. However, it is possible that while they are not the same instance, they are actually the same view (same html source). In this case the transition will be run. If you wish to disable transitions in this case, then set the composition setting `skipTransitionOnSameViewId` to _true_.

#### Cache Views
In certain case, you may be able to turn on a special optimization. Set `cacheViews:true` on your compose binding and Durandal will not remove old views from the DOM. Instead, it will match view models with existing views and simply run the transition. This allows the framework to bypass html parsing, apply bindings and DOM insertion when the view already exists. This will only happen if the bound object instance is the same as the existing view, otherwise the view will need to be re-created.

> **Note:** See below for details on how this affects _viewAttached_.

#### Activate

By default, if your bound object instance has an `activate` function, the composition engine will exeucte it prior to calling the [binder](/documentation/api#module/binder). If you don't want this to happen, set `activate:false` on your compose binding.

> **Note:** If you are using an [activator](/documentation/api#module/activator), it will control the activation call and you should not attempt to manipulate it via the compose binding.

#### Preserve Context
Whenever a compose happens, an isolated binding context is created around that composed view and view model. So, from inside that view, you cannot reach outside to a different model object. We believe this is really important for encapsulation because we've seen some really bad architectural things happen when you can "accidentally" reference things outside of the scope. As a result, things are encapsulated by default. If you want, you can set `preserveContext:true` on the binding to "connect" the new composition to its parent and enable walking up the tree from inside the child composition, but that is not the default. The exceptions to that are when you compose only a view without a module. This is obvious because it must bind to the parent context or else not bind at all. The other exception is inside templated parts. These parts can reach the outer scope in which they are actually declared, because from a developers point of view, the parts "appear" to actually be in that scope and they often need to access it.

#### Area
You can specify an _area_ to pass along with your model to the view locator. This can be used to help further specify sub-group organization of views. For example, you might have a set of readonly views and a set of editing views for models. Setting (or binding) the area property can help the view locator select different views in different scenarios. By default, whenever a view is composed without a model, the composition framework sets _area_ to "partial".

#### Activation Data
If you set the _activationData_ property of a compose binding, the value you set will be passed through to the bound module's _activate_ callback.

#### Mode

The default composition mode interprets the child elements of a composition site as "splash" or "loader" content and completely overwrites it once the new view is ready to be composed into place. However, this is not the only mode. By setting `mode:'inline'` you can tell the composition engine that the module you are binding should actually be bound directly against the child elements, without searching for an external view. Here's an example:

```html
<!--ko compose: { model:'myModel', mode:'inline'}-->
    <h3 data-bind="text: someProperty"></h3>
<!--/ko-->
```

In this case, the compositoin system will locate the "myModel" module and then it will databind it against the `h3` inside the composition element.

You can also use `mode:'templated'`. This mode allows you to create replacable parts in your view, which can be overridden at the composition site. Let say we have the following view:

```html
<div>
    <h2>My View</h2>
    <span data-bind="text: someProperty"></span>
    <div data-part="content">Some default content goes here.</div>
</div>
```

Notice that the `div` is marked with `data-part="content"`. This identifies this portion of the view as templatable or replaceable. When the composition system composes this view into the DOM, you can optionally provide your own content for this part. Here's an example of what a consumer of this view might look like:

```html
<!--ko compose: { view:'myView.html', mode:'templated' }-->
    <div data-part="content">This is a view part override of the default content....</div>
<!--/ko-->
```

When this composition activates, the myView.html will be located and its content part will be replaced with the custom content specified.

>**Note:** Widgets leverage templated parts by default and so their composition mode is always `templated`.

### Hooks
There are three hooks into the composition pipeline which you can specify as callbacks on the composition settings object. Set _binding_ to be called immediately before the [binder](/documentation/api#module/binder) is called. The signature is `binding(child, parent, settings)` Set _attached_ to be called immediately after the view is attached to the DOM. The signature is `attached(child, parent, settings)`. Set _compositionComplete_ to be called back after the entire composition has finished (parents and children included). The signature is `compositionComplete(child, parent, settings)`. These aren't typically used in markup. They are intended to be used when utilizing the composition module in code. For example, they are used internally by the dialog plugin.

#### Composition Lifecycle
Whenever Durandal composes, it also checks your model for various callback functions at different points in the compositoin process. The sequence of callbacks is referred to as the _composition lifecycle_. The lifecycle is as follows: getView, activate, binding, bindingComplete, attached, compositionComplete, detached. You can find more information in the section on [Hooking Lifecycle Callbacks](/documentation/Hooking-Lifecycle-Callbacks).

> **Note:** If you have set `cacheViews:true` then _attached_ will only be called the first time the view is shown, on the initial bind, since technically the view is only attached once. If you wish to override this behavior, then set `alwaysTriggerAttach:true` on your composition binding.