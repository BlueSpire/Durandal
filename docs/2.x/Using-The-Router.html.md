---
title: Docs - Router
layout: docs
tags: ['docs','router','reference']
---
# Router
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>Durandal provides a [router plugin](/documentation/api#module/router) designed to make building navigation applications quick and easy.</li>
    <li>The router works in tandem with the [history plugin](/documentation/api#module/history) to map route patterns to modules in your code.</li>
    <li>To use the router, you must install the plugin, configure your routes and bind it in the UI.</li>
  </ul>
</blockquote>

### Configuration

The router is a singleton module. There is only one per application and it can be thought of as a "front controller" which maps route patterns to modules. Therefore, it is important to configure the routes correctly. But, before you do this, you need to install the router plugin. In your _main.js_ file, before calling [app.start()](/documentation/api#module/app/method/start) you will need to make a call to [configurePlugins(...)](/documentation/api#module/app/method/configurePlugins). Here's what your code might look like:

```javascript
define(['durandal/app'],  function (app) {
    app.configurePlugins({
        router: true
    });

    app.start().then(function () {
        app.setRoot('shell');
    });
});
```

Once the plugin is installed, you should then configure it in your shell. Here's a sample configuration that demonstrates this:

```javascript
define(function (require) {
    var router = require('plugins/router');

    return {
        router: router,
        activate: function() {
            router.map([
                { route: '',                    moduleId: 'home/index'                                          },
                { route: 'home',                moduleId: 'home/index',                             nav: true   },
                { route: 'tickets',             moduleId: 'tickets/index',                          nav: true   },
                { route: 'tickets/:id',         moduleId: 'tickets/thread'                                      },
                { route: 'users(/:id)',         moduleId: 'users/index',        hash:'#users',      nav: true   },
                { route: 'settings*details',    moduleId: 'settings/index',     hash:'#settings',   nav: true   }
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});
```

A few things to note:

1. The router is added as a property on the shell, so that we can bind it in our shell's view. This allows the view to update based on what the current route is. (View markup discussed below.)
2. We map route patterns by calling [map()](/documentation/api#class/Router/method/map) and passing an array of configuration objects.
3. We can optionally call [buildNavigationModel()](/documentation/api#class/Router/method/buildNavigationModel) to take all routes marked with `nav:true` and create an array of their configuration data, suitable for binding in a navigation structure.
4. We call [activate()](/documentation/api#module/router/method/activate) on the router and return its promise from the shell's `activate` callback so that the composition engine will wait until the router is ready before displaying the shell.

#### Mapping Routes

Let's look in more detail at the route mapping from above. We've demonstrated a few different types of patterns here. Minimally, you will want to provide a `route` and a `moduleId`. When the url hash changes, the router will detect that and use pattern matching to find the correct route, according to your configuration. It will then load the module with the specified id and activate and compose the screen. Optionally, you can provide a `nav` property. Calling [buildNavigationModel()](/documentation/api#class/Router/method/buildNavigationModel) will create an observable array on the router called [navigationModel](/documentation/api#class/Router/property/navigationModel) which will contain only the routes marked with `nav:true`. You can also provide a number value for the `nav` property and that will be used to order the array. Another optional property, not seen above, is the `title` property. If supplied, this will be used to set the `document.title` when the navigation completes. The `hash` you see in some cases above is purely used for databinding to an `a` tag, which you will see shortly. The router attempts to generate a hash for every configured route, if one is not provided.

Here's an examplanation of the patterns you see above:

* Default route: `route: ''`
* Static route: `route: 'tickets'`
* Parameterized route: `route: 'tickets/:id'`
* Optional Parameter route: `route: 'users(/:id)'`
* Splat Route: `route: 'settings*details'`

As you can see, it's easy to create routes with parameters. A parameter is preceded by a `:`. If you wish to make the parameter optional in the matching process, you can surround it with `(` and `)`.  Finally, a `*` denotes a "splat" route. In this case we match _anything_ starting at the position of the `*`.

#### Binding the Router

Once the router is configured, you will want to display the current "page" somewhere in your app, and you may also wish to databind a navigation UI. Let's see an example of what that might look like. For this, let's look at our shell for the official Durandal samples:

<figcaption>Samples shell.js</figcaption>
```javascript
define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
                { route: '',                            moduleId: 'hello/index',            title: 'Hello World',       nav: true },
                { route: 'view-composition',            moduleId: 'viewComposition/index',  title: 'View Composition',  nav: true },
                { route: 'modal',                       moduleId: 'modal/index',            title: 'Modal Dialogs',     nav: true },
                { route: 'event-aggregator',            moduleId: 'eventAggregator/index',  title: 'Events',            nav: true },
                { route: 'widgets',                     moduleId: 'widgets/index',          title: 'Widgets',           nav: true },
                { route: 'master-detail',               moduleId: 'masterDetail/index',     title: 'Master Detail',     nav: true },
                { route: 'knockout-samples*details',    moduleId: 'ko/index',               title: 'Knockout Samples',  nav: true, hash: '#knockout-samples' }
            ]).buildNavigationModel()
              .mapUnknownRoutes('hello/index', 'not-found')
              .activate();
        }
    };
});
```

<figcaption>Samples shell.html</figcaption>
```html
<div>
    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
            <a class="brand" data-bind="attr: { href: router.navigationModel()[0].hash }">
                <i class="icon-home"></i>
                <span>Durandal</span>
            </a>
            <ul class="nav" data-bind="foreach: router.navigationModel">
                <li data-bind="css: { active: isActive }">
                    <a data-bind="attr: { href: hash }, html: title"></a>
                </li>
            </ul>
            <div class="loader pull-right" data-bind="css: { active: router.isNavigating }">
                <i class="icon-spinner icon-2x icon-spin"></i>
            </div>
        </div>
    </div>
    
    <div class="container-fluid page-host" data-bind="router: { transition:'entrance' }"></div>
</div>
```

If you look at the JS, you will see that we are following much the same patterns as previously. Let's turn our attention to the bound view. First, notice the router binding at the bottom. The router binding looks for a property on your view model named `router` and automatically connects it into the composition system so that the active page is displayed at this location. (This is just a sugar over the `compose` binding). We've also indicated a transition animation to play when navigating as well.

There are some other interesting points in this view as well. Notice that `foreach` binding against the `navigationModel` property of the router. This is the array that was built when we called [buildNavigationModel()](/documentation/api#class/Router/method/buildNavigationModel). You can see here how it can be used to build a simple nav header. Note that each navigable route in the model has an `isActive` flag which will be true when the associated route is active. The final thing to notice is that we have bound a simple spinner animation to the [router.isNavigating](/documentation/api#class/Router/property/isNavigating). As a result, we will show a spinner animation during navigation. This is particularly useful if modules that are navigated to utilize the `activate` callback to do asynchronous data loading.

### Route Parameters and Query Strings

You know how to create route patterns that include parameters, but how do you receive those parameters in your module so you can act on them? As it turns out, all you have to do is implement the `activate` callback, with one argument per route parameter. When the router is about to activate your route, it will call both `canActivate` and `activate` passing you the values extracted from the url. So, if you had a route like this `customer/:customerId/orders/:orderId` then your activate signature would look like this: `activate(customerId, orderId)`. If the route has a query string, it will be passed as the last argument. It has the form of a hash; an object with one key per query string key.

> **Note: ** The router uses an [activator](/documentation/api#module/activator/class/Activator) internally to activate every module that is navigated to. This allows the router to enforce the Activator Lifecycle, which you can read more about [here](/documentation/Hooking-Lifecycle-Callbacks). There is an important additinal functionality to note though. As usual, you can return true/false (or a promise) from the `canActivate` callback. But, with the router, you can also return a route instruction that indicates a redirect url if you want to disallow activation. For example, you can return `{redirect:'some/other/route'}` from `canActivate`.

### Triggering Navigation

The primary way to trigger navigation is through the use of `a` tags with propper hashes. However, you can also trigger navigation through code with [navigate](/documentation/api#class/Router/method/navigate). To do this call `router.navigate('your/hash/here');` This will trigger a navigation and the associated module will be activated. If you wish to add a new history entry, but not trigger module activation, you can invoke `router.navigate('your/hash/here', false);` Finally, you may wish to simply replace the history entry. To do that and not trigger, you would invoke `router.navigate('your/hash/here', { replace: true, trigger: false });`

If you wish to trigger a back navigation, you can call [router.navigateBack();](/documentation/api#class/Router/method/navigateBack).

### Handling Unknown Routes

The router has hooks for handling routes that have not been explicitly mapped. This can be used to display a "Not Found" view, automatically map urls to module ids, or even create your own convention-based routing scheme. Here are a few examples of how to use [mapUnknownRoutes()](/documentation/api#class/Router/method/mapUnknownRoutes).

<figcaption>Mapping Unknowns to a Not Found Module</figcaption>
```javascript
router.mapUnknownRoutes('notfound', 'not-found');
```

This would map all unidentified route patterns to a module with id _notfound_ and it would then replace the browser history entry with the value "not-found".

<figcaption>Automapping Routes to Modules</figcaption>
```javascript
router.mapUnknownRoutes();
```

This will automatically interpret url patterns as module ids. So, a route of `home` would map to a module with id of `home`.

<figcaption>Conventional Mapping</figcaption>
```javascript
router.mapUnknownRoutes(function(instruction){
    //use the instruction to conventionally configure a module
});
```

This final, advanced usage give you access to the route instruction. The structure of the object is as follows:

```javascript
{
    fragment: string,
    queryString: string,
    config: {
        route: string,
        routePattern: RegExp,
    },
    params: object[],
    queryParams: object
}
```

You can examine the `fragment`, `params` and `queryParams` to determine a module. Then, simply set `config.moduleId` and the router will handle the navigation from there. You can also return a promise from this callback, if you need to asynchronously determine the module to handle the request. It's probably also a good idea to set the `title` property on the config as well.

> **Note:** You should always call [mapUnknownRoutes()](/documentation/api#class/Router/method/mapUnknownRoutes) last, after all your standard mapping configuration is done.

### Child Routers

Your application has one main router, but can have multiple child routers. This provides you with a way to handle more complex deep-linking scenarios as well as encapsulate routes within features areas. Typically, the parent router will map a route with a splat. The child router will then work relative to that route, mapping its own set of routes. Let's look at an example from the samples, shortened for clarity:

<figcaption>Samples shell.js</figcaption>
```javascript
define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
                { route: 'knockout-samples*details', moduleId: 'ko/index', title: 'Knockout Samples',  nav: true, hash: '#knockout-samples' }
            ]).buildNavigationModel()
              .mapUnknownRoutes('hello/index', 'not-found')
              .activate();
        }
    };
});
```

This shows how the knockout samples are mapped at the root level with a splat route. Now, let's look at the module this route points to:

<figcaption>Samples ko/index.js</figcaption>
```javascript
define(['plugins/router', 'knockout'], function(router, ko) {
    var childRouter = router.createChildRouter()
        .makeRelative({
            moduleId:'ko',
            fromParent:true
        }).map([
            ...
            { route: 'simpleList',      moduleId: 'simpleList/index',       title: 'Simple List',           type: 'intro',      nav: true },
            { route: 'betterList',      moduleId: 'betterList/index',       title: 'Better List',           type: 'intro',      nav: true},
            { route: 'controlTypes',    moduleId: 'controlTypes/index',     title: 'Control Types',         type: 'intro',      nav: true },
            ...
        ]).buildNavigationModel();

    return {
        router: childRouter //the property on the view model should be called router
    };
});
```

We start by requiring the root router and calling [router.createChildRouter()](/documentation/api#class/Router/method/createChildRouter). This creates a new router. Notice that we have set it as a property on the module, called _router_. This follows the same pattern we used with the root router, and you can use the exact same binding in your child view. We then make use of an API called [makeRelative](/documentation/api#class/Router/method/makeRelative) by passing it a simple configuration object. The `moduleId` parameter indicates that we want all modules in our route config to be prefixed with this, affectively making the modules relative to a folder. The second option `fromParent` makes all our routes relative to the parent router's route. In this case that means that `route:'simpleList'` will be relative to the parent route of `route:'knockout-samples*details'`. The result with be a match of `knockout-samples/simpleList`. If the `fromParent` setting doesn't work for your scenario, you can provide another options `route` which works like the `moduleId` option but provides an explicit relative route for all route patterns.

Now, what happens when someone actually navigates to "knockout-samples/simpleList"? Here's how routing works in this scenario: First the pattern "knockout-samples*details" will be matched at the root router level. The root router will then cause a navigation to "ko/index". The root router will then detect the presence of the `router` property on this module and assume that it hosts a child router. So, it will then pass control to the child router to match next. It will then match on the full pattern and activate the "ko/simpleList/index" module in its view.

### Module Reuse

Consider the scenario where a history change causes a navigation that results in the same module as is already active and being viewed. Normally, even though the module is the same type, it will be discarded and a new instance created. There are two exceptions to this:

1. If the module has a child router associated with it. The instance will be kept.
2. If the module has a special callback implemented, called `canReuseForRoute`, this function will be called allowing the developer to determine if the module should be discarded or not.

When implementing `canReuseForRoute` you should return either `true` to indicate that the module instance should be reused, or `false` to indicate otherwise. This callback will receive the activation parameters from the route as its arguments, so you can make a decision based on the data.

> **Note:** It may sometimes be desirable to have modules with child routers be re-created. You can use this hook to override the default behavior there as well.

### Customization

There are several place you may want to override functionality of the router. Here's a list of relevant functions:

* [updateDocumentTitle()](/documentation/api#class/Router/method/updateDocumentTitle) - Replace this function to take control of how the router re-writes the document title when navigating. You only need to do this on the root router.

* [convertRouteToHash()](/documentation/api#class/Router/method/convertRouteToHash) - The router attempts to automatically turn route patterns into hashes when a hash is not specified. You don't actually need a hash, but it is useful for binding a nav UI. If you need to customize the autogeneration of hashes, you can use this hook.

* [convertRouteToModuleId()](/documentation/api#class/Router/method/convertRouteToModuleId) - If you do not provide a moduleId as part of your route config, the router will try to infer one from your route pattern. It is recommended that you always be explicit about routes, or use the [mapUnknownRoutes](/documentation/api#class/Router/method/mapUnknownRoutes) API to implement conventions. But, if you like, you can use this hook to change the automatic behavior.

* [convertRouteToTitle()](/documentation/api#class/Router/method/convertRouteToTitle) - If you do not provide a title as part of your route config, the router will attempt to generate one from the route. You can use this hook to customize that.

The router module includes [events](/documentation/api#module/events) capabilities, and exposes a number of interesting events you may need to tie into to customize or respond to behavior. You can find the complete list of events listed in the [module API docs](/documentation/api#module/router/class/Router).

### Activation Options

When you call [router.activate()](/documentation/api#module/router/method/activate) in your shell, you can actually pass an options object. You may have noticed that the router uses hash change events by default, but there are other options and related settings. Here's what is available:

```javascript
{
    /**
     * The url root used to extract the fragment when using push state.
     */
    root: string,

    /**
     * Use hash change when present.
     */
    hashChange: boolean,

    /**
     * Use push state when present.
     */
    pushState: boolean,

    /**
     * Prevents loading of the current url when activating history.
     */
    silent: boolean,
}
```

### Other Notable APIs

You can look at the full router API [here](/documentation/api#module/router). But, there are a couple of other noteworty APIs to explicitly call out:

* [activeInstruction()](/documentation/api#class/Router/property/activeInstruction) - An observable surfacing the active routing instruction that is currently being processed or has recently finished processing. The instruction object has config, fragment, queryString, params and queryParams properties.

* [reset()](/documentation/api#class/Router/method/reset) - Resets the router by removing handlers, routes, event handlers and previously configured options.