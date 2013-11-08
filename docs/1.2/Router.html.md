---
title: Docs - Router
layout: docs
tags: ['docs','router','reference']
---
# Router
#### 

> Durandal provides a router plugin, currently based on [SammyJS](http://sammyjs.org/). The router abstracts away the core configuration of Sammy and re-interprets it in terms of durandal's composition and activation mechanism. To use the router, you must require it, configure it and bind it in the UI.

### Configuration
The router is a singleton module. There is only one per application and it can be thought of as a "front controller" which maps route patterns to modules. Therefore, it is important to configure the routes correctly. There are several ways to do it:

> **Note:** Regardless of how you map routes (as described below), you must map them from most specific to least specific. If you need your nav order to be different from the order you need to map in, you can add a settings object onto your route info, then create a computed observable against the router's visibleRoutes collection, which sorts by your custom setting. Bind to that in the UI to create your properly ordered navigation structure.

#### mapAuto

Once the router is required, you can call `router.mapAuto()`. This is the most basic configuration option. When you call this function (with no parameters) it tells the router to directly correlate route parameters to module names in the _viewmodels_ folder. For example, a route of `#/customers` would automatically map to `viewmodels/customers` Any additional parts of the path are captured as an array and pushed into your module's _activate_ function (if it has one) as a splat parameter. So, `#/customers/1` will map to `viewmodels/customers` and if that module has an _activate_ function, it will be called with the following argument:

```javascript
{
    splat:['1'],
    routeInfo:{ ...the original route info object... },
    router:{ ...the router itself... }
}
```

If you wish to place your auto-mapped modules into a different location, simply specify a path relative to the app root as a parameter to _mapAuto_ like this `mapAuto('controllers')` Now, if we get the route `#/customers` it will map to `controllers/customers`.

> **Note:** _mapAuto_ is useful to get up and going quickly and works well for small applications, especially where there are little to no router parameters. If  you are using parameters frequently, it's advisable to use one or more map* configuration options below. It's also important to note that _mapAuto_ can be used in combination with explicitly mapped routes (as described below) so that you can map routes with parameters explicitly and then let everything else fallback to automapping.

#### map*

Besides _mapAuto_ there are several other APIs which begin with _map_, here referenced collectively by the term _map*_. These functions are used to explicitly register routes. Below is a list of these functions along with explanations and examples.

* `function map(routeOrRouteArray) : routeInfo/rounteInfo[]` - This function takes an array of _routeInfo_ objects or a single _routeInfo_ object and uses it to configure the router. The finalized _routeInfo_ (or array of infos) is returned.

* `function mapRoute(urlOrConfig, moduleId, name, visible) : routeInfo` - You can pass a single routeInfo to this function, or you can pass the basic configuration parameters. _url_ is your url pattern, _moduleId_ is the module path this pattern will map to, _name_ is used as the document title and _visible_ determines whether or not to include it in the router's _visibleRoutes_ array for easy navigation UI binding.

* `function mapNav(urlOrConfig, moduleId, name) : routeInfo` - Works the same as _mapRoute_ except that routes are automatically added to the _visibleRoutes_ array.

So, what is a _routeInfo_ object? Here's a json sample to show you:

```javascript
{
    url:'url/pattern', //the only required parameter,
    name: 'Used For Title', //if not supplied, router.convertRouteToName derives it
    moduleId: 'module/path', //if not supplied, router.convertRouteToModuleId derives it
    caption: 'Optional Caption', //derived from name if not present
    settings: {}, //your custom info, set to empty object if not provided
}
```

As you can see, the only required parameter is _url_ the rest can be derived. The derivation happens by stripping parameters from the url and casing where appropriate. So a call to `mapNav('flickr')` will result in:

```javascript
{
    url:'flickr', //you provided this
    name: 'Flickr', //derived
    moduleId: 'flickr', //derived
    caption: 'Flickr', //derived (uses to set the document title)
    settings: {}, //default,
    hash: '#/flickr', //calculated
    visible: true, //from calling mapNav instead of mapRoute
    isActive: ko.computed //only present on visible routes to track if they are active in the nav
}
```

You can always explicitly provide url, name, moduleId, caption, settings, hash and visible. In 99% of situations, you should not need to provide hash; it's just there to simplify databinding for you. Most of the time you may want to teach the router how to properly derive the moduleId and name based on a url. If you want to do that, overwrite `function convertRouteToName(url):name` and/or `function convertRouteToModuleId(url):moduleId`.

For information on route url patterns, see the [SammyJS documentation](http://sammyjs.org/). But basically, you can have simple routes `my/route/`, parameterized routes `customers/:id` or Regex routes. If you have a parameter in your route, then the activation data passed to your module's activate function will have a property for every parameter in the route (rather than the splat array, which is only present for automapped routes).

### Activation
After you've configured the router, you need to activate it. This is usually done in your shell. Here's what your shell might look like:

```javascript
define(function(require) {
    var router = require('durandal/plugins/router');

    return {
        router: router,
        activate: function() {
            router.mapAuto();
            return router.activate('first');
        }
    };
});
```

As you can see, the shell configures the route with the most basic configuration by using mapAuto. It then calls the router's _activate_ function, passing in the default route. The activate function of the router returns a promise that resolves when the router is ready to start. To use the router, you should add an activate function to your shell and return the result from that. The application startup infrastructure of Durandal will detect your shell's activate function and call it at the appropriate time, waiting for it's promise to resolve. This allows Durandal to properly orchestrate the timing of composition and databinding along with animations and splash screen display. 

### Binding
Once you've configured and activated your router, you won't be able to see the effects of page navigation, unless you have properly bound it to your shell's view. The router exposes a number of observable properties which are useful for binding:

* `allRoutes` - An observable array containing all route info objects.
* `visibleRoutes` - An observable array containing route info objects configured with `visible:true` (or by calling the `mapNav` function).
* `isNavigating` - An observable boolean which is true while navigation is in process; false otherwise.
* `activeItem` - An observable whose value is the currently active item/module/page.

Additionally, each _routeInfo_ in the _visibleRoutes_ array has an _isActive_ observable which indicates whether the module associated with that route is currently active.

Here's an example of how you might use a number of those properties to create your shell's view:

```html
<div>
    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
            <a class="brand" data-bind="attr: { href: router.visibleRoutes()[0].hash }">
                <i class="icon-home"></i>
                <span>Durandal</span>
            </a>
            <ul class="nav" data-bind="foreach: router.visibleRoutes">
                <li data-bind="css: { active: isActive }">
                    <a data-bind="attr: { href: hash }, html: name"></a>
                </li>
            </ul>
            <div class="loader pull-right" data-bind="css: { active: router.isNavigating }">
                <i class="icon-spinner icon-2x icon-spin"></i>
            </div>
        </div>
    </div>
    
    <div class="container-fluid page-host">
        <!--ko compose: { 
            model: router.activeItem,
            afterCompose: router.afterCompose
        }--><!--/ko-->
    </div>
</div>
```

This example is taken from the starter template and shows how a full navigation bar, including active highlighting and loading spinner can be created by binding to the router. The most important part to observe is how the _compose_ binding is set up. You must wire both the _model_ and the _afterCompose_ callback to the router in order for everything to work properly.

### Customization
We've already seen a couple ways to customize the router, but there are a few more:

* `function useConvention(rootPath)` - As mentioned above, if you configure a route with only the url, the router can try to determine the moduleId. It does this my simply stripping out any parameters which may be a part of the url pattern. However, a common convention is to have all page view models in a particular path. You can establish that convention by calling this function. If you pass no _rootPath_ then it will be _viewmodels_. As an example, without calling _useConvention_ a call to `mapRoute('myPage/:id')` will yield a moduleId of 'myPage'. But if you call `useConvention('pages')` before you do your mapping, then the same call to _mapRoute_ will result in a moduleId of 'pages/myPage'.

* [overridable](/documentation/Overridable) `function handleInvalidRoute(route, params)` - This is called any time the router cannot locate an appropriate route based on the url. The default implementation logs the information. You can override this function to handle this scenario in your own way.

* [overridable](/documentation/Overridable) `function onNavigationComplete(routeInfo, params, module)` - When the router successfully completes a navigation to a screen, this function is called. The default implementation uses the _routeInfo_ to set the document's title. You can override this function to set the title yourself or to add any code you wish to execute when a navigation completes.

* [overridable](/documentation/Overridable) `function convertRouteToName(route):string` - Takes a route in and returns a calculated name.

* [overridable](/documentation/Overridable) `function convertRouteToModuleId(route):string` - Takes a route in and returns a calculated moduleId. Simple transformations of this can be done via the _useConvention_ function above. For more advanced transformations, you can override this function.

* [overridable](/documentation/Overridable) `function prepareRouteInfo(info)` - This should not normally be overwritten. But advanced users can override this to completely transform the developer's routeInfo input into the final version used to configure the router.

* [overridable](/documentation/Overridable) `function autoConvertRouteToModuleId(route, params)` - This can be overwritten to provide your own convention for automatically converting routes to module ids.

* [overridable](/documentation/Overridable) `function getActivatableInstance(routeInfo, params, module) : object` - Translates the module into the object instance that should be activated by the router. The default implementation returns the module if it is an object or uses new to invoke it if it is a function, returning the result.

* [overridable](/documentation/Overridable) `function guardRoute(routeInfo, params, instance) : object` - Before any route is activated, the _guardRoute_ funtion is called. You can plug into this function to add custom logic to allow, deny or redirect based on the requested route. To allow, return _true_. To deny, return _false_. To redirect, return a string with the hash or url. You may also return a promise for any of these values.

### Other APIs
In addition to configuration, binding and customization, there are some basic APIs you may find useful in your application:

* `function navigateBack()` - Causes the router to move backwards in page history.

* `function navigateTo(url [, mode])` - Causes the router to navigate to a specific url. If you include the _mode_ value of 'skip' then a new history entry will be added, but the corresponding route will not be activated. 
If you include the _mode_ value of 'replace' then the current history will be replaced and the route will be activated. By default, a new history entry is added and route activation is processed.

* `function replaceLocation(url)` - This is just a wrapper for `navigateTo(url, 'replace');`.