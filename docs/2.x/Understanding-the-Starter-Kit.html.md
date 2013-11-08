---
title: Docs - Understanding the Starter Kit
layout: docs
tags: ['docs','how to','setup']
---
# Understanding the Starter Kit
#### 

> The Durandal StarterKit sets up a basic navigation-style architecture for you along with a couple of basic screens. Adding your own screens is as simple as creating modules and views, putting them in the proper location and registering them with the router. Let's see how this application is put together...

### Application Organization

If you expand the _App_ folder, you will find the source for the entire SPA sample. Here's the high level organization you will find:

* App
    * durandal/
    * viewmodels/
    * views/
    * main.js

Durandal applications are built as a collection of AMD modules. In fact, Durandal itself is just a set of modules. All the core modules can be found in the _durandal_ folder. The _viewmodels_ and _views_ folders contain the application-specific code. In your own application, you can organize your app-specific code in any way that makes sense to you. For purposes of this sample, we've located our viewmodels and views in folders thusly-named (a common convention). Finally, much like a native application, your app execution always starts with _main_ which is referenced in the _index.html_.

### index.html

The _index.html_ has all the things you would expect, such as meta, css links and 3rd party script references. The interesting part is the body:

```html
<body>
    <div id="applicationHost"></div>
    <script type="text/javascript" src="/App/durandal/amd/require.js" data-main="/App/main"></script>
</body>
```

The _applicationHost_ is where your app's views will live. We'll talk about how that happens a bit more in the next section. Below that is the script tag that references RequireJS. It points to our application's entry point, declared in the _data-main_ attribute. At runtime, this resolves to the _main.js_ file.

### main.js

The _main.js_ module is where you configure durandal and tell it to start up the app. Let's look at the main module and see what we can learn:

```javascript
define(function(require) {
    var app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator'),
        system = require('durandal/system'),
        router = require('durandal/plugins/router');

    system.debug(true);

    app.start().then(function () {
        viewLocator.useConvention();
        
        router.useConvention();
        router.mapNav('welcome');
        router.mapNav('flickr');

        app.adaptToDevice();
        app.setRoot('viewmodels/shell', 'entrance');
    });
});
```

The most important thing to learn from this example is that all app-specific code is written as modules. There is one module per file and each module declares itself by calling `define`. It can then _require_ other modules in the application by referencing their path. In this example, we can see that our _main_ module is dependent on four other modules _app_, _viewLocator_, _system_ and _router_.

> **Note:** When calling _define_ to declare a module, you pass it a function, which returns your module. This is important. The return value of your function is your module and is the same object that will be passed to any consumer that calls _require_. You can return either an object (singleton modules) or a function (for constructors) from your define call. For further information on creating modules, see the RequireJS documentation.

The next thing of note is the call to `system.debug(true)`. Durandal's _system_ module has a _log_ function which it uses to output important insights into the working of the framework. This log implementation is cross-browser and will only be output when debugging is turned on, as it is here. This logging information can help you track down issues with your code as well as give you a deeper understanding of how Durandal works. It is also handy for use in your own app-specific code.

In order to kick things off, we call `app.start()` which returns a promise. The promise resolves when the dom is ready and the framework is prepared for configuration. At that point we set up our _viewLocator_ and _router_. Then, we call `app.adaptToDevice()` to make sure that our app acts like a SPA, especially on mobile divices. Finally, we call `app.setRoot`. Let's go over a few of these APIs:

1. `viewLocator.useConvention()` - Whenever durandal needs to display a module, it uses the _viewLocator_ to find the appropriate view. Usually, it's a straight name mapping. So, _welcome_ would map to _welcome.html_. When we call `useConvention()` we tell the framework that we have a conventionally organized project where we are putting all view models in a particular place and all views in a particular place. So, it maps accordingly. The standard convention would map _viewmodels/welcome_ to _views/welcome.html_. You can change all of this, of course. Details are provided in the docs on the view locator.

2. `router.useConvention()` and `router.mapNav()` - Our calls to _mapNav_ register a route pattern with the router, and specify that these routes are intended to be displayed as part of the app's navigation UI. There are many ways to map routes. Here we see the simplest, where _mapNav_ is called with one parameter. This parameter is the route. Durandal's router attempts to map routes to modules. So, by default, if we don't specify a specific module (the optional second parameter to mapNav) then the router assumes the module has the same name as the route (minus any parameters). But, in our case, we are using the standard convention for organizing by viewmodels and views. So, we need to tell the router that by calling _useConvention_. In this case, if the _mapNav_ call doesn't specify a module, it will assume that it's the same as the router name, but in the _viewmodels_ folder. So `mapNav('welcome')` tells the routing mechanism to map the uri hash '#/welcome' to the `viewmodels/welcome` module.

3. `app.setRoot()` - This is what actually causes the dom to be composed with your application. It points to your main viewmodel (or view). When this is called, Durandal's composition infrastructure is invoked causing RequireJS to require your root view model, use the _viewLocator_ to locate it's view, databind them together and inject them into the _applicationHost_ element. Additionally, the 'entrance' transition animation is used to animate the app in.

The code described above differs from app to app, but usually your main.js will follow the same simple steps every time:

0. (Turn on debugging).
1. Call `app.start()`.
2. Configure your app-specific conventions.
3. Configure 3rd party libraries.
4. Set your application's root.

### The Shell

Every application has a shell/window/layout/etc. We set that by calling `setRoot` as described above. Typically, you will have both a code and view component to your shell, as is demonstrated in our starter kit. Let's look at simplified versions of those to see how they work:

*shell.js*
```javascript
define(function(require) {
    var router = require('durandal/plugins/router');

    return {
        router: router,
        activate: function () {
            return router.activate('welcome');
        }
    };
});
```

*shell.html*
```html
<div>
    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
            <ul class="nav" data-bind="foreach: router.visibleRoutes">
                <li data-bind="css: { active: isActive }">
                    <a data-bind="attr: { href: hash }, html: name"></a>
                </li>
            </ul>
        </div>
    </div>
    
    <div class="container-fluid page-host">
        <!--ko compose: { 
            model: router.activeItem,
            afterCompose: router.afterCompose,
            transition:'entrance'
        }--><!--/ko-->
    </div>
</div>
```

When you call `setRoot`, Durandal requires both the module and the html and uses Knockout to databind them together. It then injects them into the dom's _applicationHost_. If you look at the module, you will see that we have exposed the router as a property called _router_. Then, look at the html for the "nav bar" and you will see that we are dynamically generating our navigation structure based on the router's _visibleRoutes_ array. Below that we have a container where our pages will be switched in and out. How does that work?

Durandal takes Knockout's databinding implementation and layers a powerful "composition" system on top of it. In the case of our shell, the router is tracking the current route. It stores the route's module instance in its _activeItem_ observable property. The router is then bound through Durandal's _compose_ binding. Now any time the router changes it's active item, the dom will re-compose with the new view. Here's how it happens:

1. A route is triggered and the router finds the module and sets it as its _activeItem_.
2. The _compose_ binding detects that the _activeItem_ has changed. It examines the value and finds the appropriate view (you guessed it...using the _viewLocator_).
3. The _activeItem_ and the located view are databound together.
4. The bound view is inserted into the dom at the location of the _compose_ binding.
5. If the _compose_ binding specifies an animation, it is used to smoothly show the new view.

The compose binding is used here to enable navigation by "composing" in different views. It is a very versatile and powerful feature of the framework capable of doing much, much more than this. By combining the ability to break down an app into small modules, each with their own view, along with the ability to re-compose in the UI, you can accomplish extremely complex user experiences, with relatively little effort.

> **Note:** It's important to note that the router must be activated with a default route before it can function properly. This is done in the shell's activate function. Durandal's application infrastructure checks the shell for an _activate_ function and calls it if found. Note that the call to `router.activate()` returns from the shell's _activate_ function. Since the router's activation is asynchronous, it returns a promise that indicates when it is ready. You should return this from the shell's activate function so that Durandal's infrastructure can understand the asynchronous nature of your application's startup and appropriately orchestrate binding and composition. You can learn more about the power of asynchronous activation and screen lifecycles in the documentation on the _viewModel_ module.

### Views and View Models

Each page in our navigation application is comprised of a view and a view model. Once you've set up the structure as described above, all there is to extending the application is dropping new view models in the _viewmodels_ folder along with an appropriate view in the _views_ folder. Then, you just register the router in _main.js_. When the corresponding router is navigated to, the router will locate your module and the composition infrastructure will see to it that it's bound and inserted into the dom.

### Summary

* Durandal apps are organized into AMD modules and HTML views.
* Developers use the _main.js_ to configure the framework, set up 3rd party libraries and start Durandal with their "root" view model (or view).
* You can use the router plugin to create a navigation-style application by requiring it and configuring it with routes.
* Your shell activates the router and provides any application-wide data or functionality.
* Use "composition" in your shell's view to realize navigation page changes.
* Extend the application by creating views and view models for each page.

### Further Reading

Durandal can do much more than described here. In the wiki you will find reference documentation on all the modules as well has How To's related to various common tasks. You'll also find information on application optimization for the web as well as how to get up in running with PhoneGap and AppJS for building native applications. Dig in and enjoy!