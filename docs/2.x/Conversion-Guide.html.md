---
title: Docs - Converting a Durandal 1.x Project to 2.0
layout: docs
tags: ['docs','conversion']
---
# Converting a Durandal 1.x Project to 2.0
#### 


> There were significant breaking changes between the 1.x version series and 2.0. Below you will find details of how to convert an existing project to the new version. For additional information, see the [API Documentation](/documentation/api) or the [various "How To" guides](/pages/docs).

### Re-locate Durandal

In the 1.x version series, Durandal was located under your `App` folder. In 2.0, the preferred location is side-by-side with other 3rd party scripts. This relocation allows Durandal to more easily be updated and tracked in the same way you do other libraries. It also provides a cleaner separation of the framework code from your application code.

To make this change:

1. Create a `durandal` folder in the same location as other 3rd party scripts in your web project and copy into it all Durandal modules, including sub-folders for plugins and transitions, if desired.
2. Move `require.js`, `text.js` and `almond-custom.js` into your 3rd party scripts folder also. (Previously located at App/durandal/amd).
3. Delete the old `durandal` folder which used to reside in your `App` folder.
4. Fix up your _index.html_ so that the RequireJS path is correct.
5. In your `main.js` file, configure RequireJS with the location of the Durandal modules. You do this by adding `requirejs.config.paths` entries. Assuming your Durandal application is in an `App` folder under your web root and all your 3rd party scripts are in a `Scripts` folder, your configuration should look like this:

```javascript
requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});
```
This should be immediately at the top of your `main.js` file.

### Configure Dependencies

Durandal depends on RequireJS, jQuery and Knockout. In version 1.x the Durandal library made the assumption that both jQuery and Knockout were available in the global script scope. This assumption was problematic for some deploy scenarios, so now Durandal requires both jQuery and Knockout to be available explicitly through the module system. There are two options for you in updating the dependency configuration. Option 1 is to use the `path` config to register jQuery and Knockout with RequireJS. This option should only be used by developers who are familiar and comfortable with `shim` configuration, as registering the modules in this way will require all 3rd party scripts to be registered similarly. Modules not designed for AMD will require shimming. Option 2 is to reference these libraries as you would normally, through script tags, then manually `define` them inside the module system. If you aren't comfortable with  `path` and `shim` config, then this option is recommended for you. 

Please choose the option that fits your project and team best:

#### Option 1: Path and Shim Config

1. Remove all script tags from your html page, except for RequireJS.
2. In `main.js` extend the `requirejs.config.paths` entries so that they include paths to jQuery and Knockout.
3. Add paths and shim config for any 3rd party libraries.

Here's an example of what the configuration would look like with the standard dependencies, plus one 3rd party library: Bootstrap.

```javascript
requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal':'../Scripts/durandal',
        'plugins' : '../Scripts/durandal/plugins',
        'transitions' : '../Scripts/durandal/transitions',
        'knockout': '../Scripts/knockout-2.3.0',
        'bootstrap': '../Scripts/bootstrap',
        'jquery': '../Scripts/jquery-1.9.1'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
       }
    }
});
```

#### Option 2: Script Tags and Manual Define

1. Keep all script libraries referenced in your html page.
2. Add two define statements after your `requirejs.config` and before the body of your main module. These statements will manually define the modules needed by Durandal. Your code should look like this:

```javascript
define('jquery', function () { return jQuery; });
define('knockout', ko);
```

### Configure Plugins

Durandal 1.x, though appearing to be modularized, was still monolithic in nature due to certain dependencies between modules. In 2.0, we have moved all non-essential functionality out of the core and into plugins. As part of this process, we have established a simple plugin loading api and extensibility point.

The `router`, `dialog` (previously modalDialog), `widget` and `http` modules were part of Durandal's core, but are now plugins. If you wish to take advantage of their functionality, you can load them in your main module using the new `app.configurePlugins` API. Below is a sample `main.js` file that demonstrates all the above mentioned configuration (manual define) along with plugin configuration.

```javascript
requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});

define('jquery', [], function () { return jQuery; });
define('knockout', [], function () { return ko; });

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'],  function (system, app, viewLocator) {
    app.title = 'My App';
    
    //specify which plugins to install and their configuration
    app.configurePlugins({
        router: true,
        dialog: true,
        widget: {
            kinds: ['expander']
        }
    });

    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot('shell');
    });
});
```

Here you can see that we provide the `configurePlugins` API with an object, where each plugin we want to load is a key. The values for those keys can be `true` to simply load the plugin, or a configuration object, as demonstrated with the `widget` plugin. In this case, the `widget` plugin configures the _expander_ widget kind. See the plugin documentation for details on any available configuration options.

### Fix Module Names and Paths

As part of the general refactoring in 2.0 some modules became plugins and others were renamed. If you used any of these modules directly, you will need to fix up your require paths throughout. Here is a chart showing the 1.x to 2.0 changes:

<table class="table table-bordered">
	<tr>
    	<th>1.x Module</th>
    	<th>2.0 Module</th>
    	<th>Path</th>
	</tr>
	<tr>
		<td>app</td>
		<td>app</td>
		<td>durandal/app</td>
	</tr>
	<tr>
		<td>composition</td>
		<td>composition</td>
		<td>durandal/composition</td>
	</tr>
	<tr>
		<td>events</td>
		<td>events</td>
		<td>durandal/events</td>
	</tr>
	<tr class="error">
		<td>http</td>
		<td>http</td>
		<td>plugins/http</td>
	</tr>
	<tr class="error">
		<td>modalDialog</td>
		<td>dialog</td>
		<td>plugins/dialog</td>
	</tr>
	<tr class="error">
		<td>messageBox</td>
		<td>-----------------</td>
		<td>(Merged into dialog.)</td>
	</tr>
	<tr>
		<td>system</td>
		<td>system</td>
		<td>durandal/system</td>
	</tr>
	<tr>
		<td>viewLocator</td>
		<td>viewLocator</td>
		<td>durandal/viewLocator</td>
	</tr>
	<tr>
		<td>viewEngine</td>
		<td>viewEngine</td>
		<td>durandal/viewEngine</td>
	</tr>
	<tr class="error">
		<td>viewModelBinder</td>
		<td>binder</td>
		<td>durandal/binder</td>
	</tr>
	<tr class="error">
		<td>viewModel</td>
		<td>activator</td>
		<td>durandal/activator</td>
	</tr>
	<tr class="error">
		<td>widget</td>
		<td>widget</td>
		<td>plugins/widget</td>
	</tr>
	<tr class="error">
		<td>router</td>
		<td>router</td>
		<td>plugins/router</td>
	</tr>
	<tr class="warning">
		<td>------------------------</td>
		<td>history</td>
		<td>plugins/history</td>
	</tr>
	<tr class="warning">
		<td>------------------------</td>
		<td>observable</td>
		<td>plugins/observable</td>
	</tr>
	<tr class="warning">
		<td>------------------------</td>
		<td>serializer</td>
		<td>plugins/serializer</td>
	</tr>
</table>

>**Note:** Red indicates changes. Yellow indicates additions.

### Update Composition and Activator Callbacks

Durandal 2.0 has a more consistent and powerful composition and activator lifecycle. We've renamed some callbacks for simplicity and consistency, as well as added new ones and adjusted the timing of others. You will need to go through your modules and make name changes where appropriate. Here's a chart to guide you in the process.

<table class="table table-bordered">
  <tr>
    <th>1.x Name</th>
    <th>2.0 Name</th>
    <th>Lifecycle</th>
    <th>Notes</th>
  </tr>

  <tr>
    <td>`getView()`</td>
    <td>`getView()`</td>
    <td>Composition</td>
    <td>Enables the new object to return a custom view.</td>
  </tr>

  <tr>
    <td>`canDeactivate()`</td>
    <td>`canDeactivate()`</td>
    <td>Activator</td>
    <td>Allows the previous object to cancel deactivation.</td>
  </tr>

  <tr>
    <td>`canActivate()`</td>
    <td>`canActivate()`</td>
    <td>Activator</td>
    <td>Allows the new object to cancel activation.</td>
  </tr>

  <tr>
    <td>`deactivate()`</td>
    <td>`deactivate()`</td>
    <td>Activator</td>
    <td>Allows the previous object to execute custom deactivation logic.</td>
  </tr>

  <tr class="warning">
    <td>----------------------</td>
    <td>`detached()`</td>
    <td>Composition</td>
    <td>Notifies the object when its view is removed from the DOM.</td>
  </tr>

  <tr>
    <td>`activate()`</td>
    <td>`activate()`</td>
    <td>Composition &amp; Activator</td>
    <td>Allows the new object to execute custom activation logic.</td>
  </tr>

  <tr class="error">
    <td>`beforeBind()`</td>
    <td>`binding()`</td>
    <td>Composition</td>
    <td>Notifies the new object when databinding is about to occur.</td>
  </tr>

  <tr class="error">
    <td>`afterBind()`</td>
    <td>`bindingComplete()`</td>
    <td>Composition</td>
    <td>Notifies the new object immediately after databinding is complete.</td>
  </tr>

  <tr class="error">
    <td>`viewAttached()`</td>
    <td>`attached()`</td>
    <td>Composition</td>
    <td>Notifies the new object when its view is attached to the DOM.</td>
  </tr>

  <tr class="warning">
    <td>----------------------</td>
    <td>`compositionComplete()`</td>
    <td>Composition</td>
    <td>Notifies the new object when the entire composition (all parents &amp; children) is complete.</td>
  </tr>
</table>

>**Note:** Red indicates changes. Yellow indicates additions.


### Switch to the New Router

The Durandal 1.x router was built on top of SammyJS. This seemed like a good idea at the time, but in the end, turned out to be quite problematic and limiting. Durandal 2.0 has an entirely new router with less code, less bugs, more features and better performance. It has no dependencies on 3rd party libraries outside of the Durandal core. The new router is split into two modules: `history` which contains the low level cross-browser history abstraction and `router` which contains the Durandal activation and composition semantics, built on top of `history`.

#### Update Configuration

The new router has a different mechanism for configuration. To configure routes, call the `map` api, providing it with an array of route configurations. If you want to databind to routes in order to create a navigation UI, call `buildNavigationModel`. You can easily handle unknown routes by calling `mapUnknownRoutes` as well (or set up conventions). Finally, you should  add a public attribute on your shell called _router_ and `activate` the router and return the promise back to Durandal. Here's an example shell configuration:

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

Looking at the `map` API, the _route_ is the pattern to match in the url and the _moduleId_ is the module to activate when that pattern is matched. You can optionally configure a _title_ to set the document to as well or a _hash_ to use in databinding (if the generated hash based on the route isn't correct; usually if the route contains parameters or splats). Finally, you can specify `nav:true` to indicate that the route should be part of the navigation model used to databind the UI. If you provide a number, such as `nav:5`, then you can order the navigation model independently of the route configuration order. See the router's documentation for further details concerning the above APIs.

>**Note:** Did you previously call `useConvention`? If so, that API has been removed. In its place is the `makeRelative` API. This can be used to tell the router that all moduleIds are relative to a certain path, or that all routes are relative to a certain base url. To achieve the same effect has `useConvention` you would call `router.makeRelative({moduleId:'viewmodels'});`

>**Note:** Did you previously call `activate` with a default route to navigate to? If so, please note that that has been deprecated. Instead, be sure to register a route with '' (empty string) as its pattern. This will designate the default route.

#### Update View

Because the router has changed, you will also need to update your shell's view. The router binding is simplified by the new router binding handler. Some minor changes to the bound navigation model are also necessary. Here's the view that corresponds to the previous module:

```html
<div>
    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
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
    
    <div class="container-fluid page-host">
        <!--ko router: { transition:'entrance', cacheViews:true }--><!--/ko-->
    </div>
</div>
```

Notice that the nav bar is built by binding the `navigationModel` array. Again, please note the new router binding handler.

#### Update Modules

The new router now not only supports parameterized routes, but also optional parameters, splats and query strings. In order to guarantee a consistent calling mechanism, one that functions more similarly to _Controllers_ in most MVC applications, the new router activates modules slightly different from 1.x. The 2.0 router will call `activate` on your module with one argument per route parameter. This includes optional parameters, even if they are not supplied. If the history state contains a query string, that will be parsed into a key/value object and passed in as the last argument. Let's see an example:

The Shell's Route Config
```javascript
define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
                { route: 'customer/:customerId/order/:orderId', moduleId: 'order' },
            ]).activate();
        }
    };
});
```

The _order_ module:
```javascript
define(function () {
    return {
        activate: function (customerId, orderId) {
			//use the customerId and orderId here
			//if the route contained a query string, there would be a 3rd argument
        }
    };
});
```
>**Note:** For those who need access to the current route's configuration in order to get at custom properties or other information, you can access the raw data via `router.activeInstruction()` The instruction contains the _fragment_, _queryString_, _params_, and _queryParams_. It also contains a _config_ property which is the same instance as your original route config.

### Fix Dialogs

First, you must configure the `dialog` module by installing the plugin as shown above. Then the dialog APIs will be available where appropriate.

If you previously used `app.showModal()` to show a dialog, this has been renamed to `app.showDialog()`. `app.showMessage()` remains the same. The `dialog` module now has `dialog.show()` (replacing modalDialog.show) and now adds `dialog.showMessage()` as well.

Previously, closing a custom dialog from inside the view model was accomplished with this code: `self.modal.close(returnValue);` In Durandal 2.0, you should use the `dialog` module to close your custom dialog.  The code for that looks like this: `dialog.close(self, returnValue);`

The `MessageBox` class and view have been merged into the `dialog` module. If you need to customize the Message Box's view, you should do it as follows: `dialog.MessageBox.setViewUrl('path/to/your/custom/view');`

If you are creating a custom model context, this has been affected by the changes to the composition system as detailed above. Modal contexts have `addHost()` and `removeHost()` as before. But the optional lifecycle callbacks have changed to `attached()` and `compositionComplete()`.

The API `modalDialog.isModalOpen()` was renamed to `dialog.isOpen()`.

### Fix Widgets

In 2.0, many of the features of widgets, such as templated parts, were pushed into the core infrastructure. Also, the core composition lifecycle was improved through greater consistency and extension points as discussed above. As a result, the widgets, which are built on top of these features, have also changed. As part of the process, we took the opportunity to fix some other issues. Here's how you get your widgets converted to 2.0:

1. In 1.x, each widget resided in a folder and had a _controller.js_ and a _view.html_. The only change to this structure and naming is that _controller.js_ should now be named _viewmodel.js_. We felt this naming was more consistent with the rest of the framework.
2. Widgets are no longer passed any information in the constructor function. Instead, a widget's settings are passed to its `activate` function. This makes widgets much more consistent with the way that normal composition works. With a widget, its settings essentially become the composition's _activationData_.

If you customized widget mapping, have a look at the new API's [map and convert methods](/documentation/api#module/widget).

### Fix Activators

Most developers don't use _activators_ directly. However, if you use the `viewModel.activator()` API, it has changed. As mentioned above, the `viewModel` module has been renamed to `activator`. Additionally, the factory method has been renamed to `create`. So, the previous API call would now be `activator.create();`. If you used the `areSameItem` override, then you should know that its signature has slightly changed: `areSameItem(currentItem, newItem, currentActivationData, newActivationData)`.

### Fix Custom Transitions

Due to improvements in the composition system, custom transitions have changed as well. On the whole, they are simpler to write now since you don't need to worry about view cache settings. If you have custom transitions, have a look at the built-in `entrance` transition and use it as a guide to updating your custom transitions.

### Miscellany

1. Removed `app.adaptToDevice();`
2. Calling `system.acquire();` with multiple ids or an array of ids, results in an array of modules being returned.
3. If you customized the `viewEngine` module, you should look at the changes to [parseMarkup](/documentation/api#module/viewEngine/method/parseMarkup) and [processMarkup](/documentation/api#module/viewEngine/method/processMarkup).
4. Removed the .NET Optimizer in favor of _Weyland_, the new cross-platform build tool for Durandal.

>In addition to these changes, there are many new features (and bug fixes) as part of this release. Have a look through the docs to discover new capabilities you could be leveraging in your app.