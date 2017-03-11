---
title: Get Started
layout: get-started
tags: ['get started']
pageOrder: 1
archive: true
---
With [RequireJS](http://requirejs.org/) as its base and a thin layer of conventions, Durandal can provide amazing productivity while helping you to maintain SOLID coding practices. Pair that with out-of-the-box support for rich UI composition, modal dialogs, eventing/messaging, widgets, transitions, routing and more....and there's no doubt you'll be able to build whatever apps you can imagine.

There are several ways to get started with Durandal, depending on your platform choice. While Durandal is a pure JavaScript library, independent of any server-side platforms, we try to package it up in a variety of ways that are appealing to web developers. For this brief tutorial, we'll use our raw HTML Starter Kit. 

> **Note:** See [the docs](/docs.html) section titled "Set Up Options" for other ways to get setup with a variety of platforms and tools including Grunt, NuGet, Visual Studio, Bower and more. 

<div style="text-align: center; margin: 64px">
  <a style="font-family: proxima-nova; font-size: 32px; text-shadow: 1px 1px 1px rgba(0,0,0,.5)" class="btn btn-large btn-success" href="/version/latest/HTML%20StarterKit.zip">Download HTML Starter Kit</a>
</div>

Once you've downloaded the HTML Starter Kit and unzipped it, you can actually run the sample app immediately by opening the `index.html` file in Firefox*, or by spinning up a web server and browsing to the index page.

<p style="text-align: center">
	<img src="/images/started-fig1.png" />
</p>

The starter kit application demonstrates a basic navigation architecture with routing, history, data-binding, modal dialogs and more. But, we're not going to look at that just yet. Instead, we're going to write our own little app from scratch. To do this, locate the app folder and delete its contents, then delete the index.html. Now we have a completely blank project, pre-configured with all our scripts and css.

> **Note:** IE, Chrome and Safari don't like serving the files directly from the file system. If you would like to use one of these browsers, simply use your preferred web server technology to serve the files.

#### index.html

Let's start by writing our own index.html file. Here's the markup we'll use:

**index.html**
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" href="lib/font-awesome/css/font-awesome.css" />
    <link rel="stylesheet" href="lib/durandal/css/durandal.css" />
    <link rel="stylesheet" href="css/starterkit.css" />
  </head>
  <body>
    <div id="applicationHost"></div>
    <script src="lib/require/require.js" data-main="app/main"></script>
  </body>
</html>
```

All we have here are a few css files, a single div called "applicationHost" and a single script tag. We've added [Bootstrap](http://getbootstrap.com/) and [FontAwesome](http://fontawesome.io/) here so we can easily make things look decent, but they aren't required by Durandal. The important piece to notice is the script tag.

Durandal encourages modular code practices by using RequireJS as one of its core building blocks. In a Durandal app, all JS code is written in modules. The script tag in our `index.html` loads RequireJS which facilitates the framework's module strategy. Once the module loader is initialized it then uses the `data-main` attribute to start up our app. This attribute points to our main module. This is much like the main function in most c-based languages. It is the entry point for our application. Let's go ahead and create that module now. To do that, first create a file named `main.js` and place it in the app folder. Here's the code for that file:

**main.js**
```javascript
requirejs.config({
  paths: {
    'text': '../lib/require/text',
    'durandal':'../lib/durandal/js',
    'plugins' : '../lib/durandal/js/plugins',
    'transitions' : '../lib/durandal/js/transitions',
    'knockout': '../lib/knockout/knockout-3.1.0',
    'jquery': '../lib/jquery/jquery-1.9.1'
    } 
});

define(function (require) {
   var system = require('durandal/system'),
       app = require('durandal/app');

   system.debug(true);

   app.title = 'Durandal Starter Kit';

   app.configurePlugins({
     router:true,
     dialog: true
   });

   app.start().then(function() {
     app.setRoot('shell');
   });
});
```

This is pretty standard “boilerplate” configuration for most Durandal apps. But, let's go over this piece by piece:

At the top we have the `requirejs.config` block. This section configures the module system so that it can find our core libraries. It's just a set of relative paths, so that the first time we reference "jQuery" for example, the module system knows where to load it from. Here you see that we have paths configured for the requirejs text plugin (used to load views), Durandal's core modules, Knockout and jQuery. In the same way that Durandal uses [RequireJS](http://requirejs.org/) for modules, it uses [Knockout](http://knockoutjs.com/) for data-binding and [jQuery](http://jquery.com/) as its browser abstraction.

After we set up the RequireJS configuration, we *define* our main module. All code in Durandal is written in modules and takes the following form:

```javascript
define(function (require) {
  var someModule = require('some/module');
  ...other modules required here...
  return someValue;
});
```

To create a module you call the define function. You pass a function to define which serves as a factory for your module. Whatever you return from this function becomes your module instance. You can return an object to create singleton object modules or a function to create class constructor modules. Additionally, you can declaratively express dependencies upon other modules. To import another module into your module you use the require function.

In our main module above, you can see that we import or require two of Durandal's modules: system and app. We then use the system module to turn on framework debugging. After that we use the app module to set our app's title and load two optional plugins. Finally, we tell the app to start, which is an asynchronous action, and when that completes we call a curious function: setRoot.

The call to setRoot is what actually causes something to be rendered on the screen. You can think of the root as your "main window", "master layout" or the "shell" of your application. The parameter points to the module which contains our shell's behavior. The only problem is..that doesn't exist yet. So, let's create it.

#### The Shell

Most components in Durandal contain both "behavior" and "content". Your application's shell should be no exception to this rule. We'll represent these two different concerns by creating two files: a JavaScript file for the behavior and an HTML file for the content.* Under your app folder create: `shell.js` and `shell.html`. I'll give you the code for each of those now, then we'll see how it all works.

> **Note:** Naturally, most applications also have "presentation" concerns as well, which are preferrably handled by CSS.

**shell.js**
```javascript
define(function (require) {
  var app = require('durandal/app'),
      ko = require('knockout');

  return {
     name: ko.observable(),
     sayHello: function() {
       app.showMessage('Hello ' + this.name() + '! Nice to meet you.', 'Greetings');
     }
   };
});
```

**shell.html**
```html
<section>
  <h2>Hello! What is your name?</h2>
  <form class="form-inline">
    <fieldset>
       <label>Name</label>
       <input type="text" data-bind="value: name, valueUpdate: 'afterkeydown'"/>
       <button type="submit" class="btn" data-bind="click: sayHello, enable: name">Click Me</button>
    </fieldset>
  </form>
</section>
```

Notice that our `shell.js` defines a module as we have previously discussed. It has dependencies on two other modules: `app` and `knockout`. Our module returns an object literal as its definition. This object has one property, `name`, and one function, `sayHello`. The `name` property is special. Here, we have used [Knockout](http://knockoutjs.com/) to create an observable property. An observable property supports two-way data-binding to html, change notification and a number of other features. Notice that the `sayHello` function uses this property to display a message box with Durandal's `app` module.

To fully understand this code, you need to look at it side-by-side with the HTML. Notice how the HTML has `data-bind` attributes in it. These attributes declaratively connect the HTML to the properties and functions in the module we just looked at. See how the input tag has a `data-bind` attribute that connections its value to our name property? It also specifies that our property should be updated after key down events (as opposed to focus change, which is the default). Also, take a look at the button. Its `click` event is bound to our `sayHello` function. Furthermore, the button will only be enabled when the `name` property has a truthy value. Pretty cool! Go ahead and run the app by opening `index.html` in Firefox or spinning up a web server to view it in another browser. When you do this, here's what's going to happen:

1. RequireJS will load.
2. RequireJS will load your `main.js` and configure the framework.
3. Your `main.j`s will present the app by calling `setRoot`.
4. The `shell.js` and `shell.html` files will be loaded, data-bound to one another and injected into the `applicationHost` div in the page.

Once it's loaded, try typing in the input field and notice how the button's enabled state changes. Then, click the button to see what happens.

#### Navigation

This is all pretty cool, but most applications don't just have one page. So, let's turn our *shell* into a navigation app. To start, rename your `shell.js` to `home.js` and your `shell.html` to `home.html`. Now, create two new files which will serve as our navigation shell. Here's the source for the new `shell.js` and `shell.html`.

**shell.js**
```javascript
define(function (require) {
  var router = require('plugins/router');
  
  return {
     router: router,
     activate: function () {
       router.map([
         { route: '', title:'Home', moduleId: 'home', nav: true }
       ]).buildNavigationModel();

       return router.activate();
     }
   };
});
```

**shell.html**
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
 <div class="container-fluid page-host" data-bind="router: { transition:'entrance' }"></div>
</div>
```

Looking at our navigation shell, you can see the same module pattern. Here we are requiring our `router` plugin and using that to create an object. We configure the router with a single route that points to our `home` module. This router configuration specifies the `route` pattern to match on, the `title` to display, the `moduleId` to load when the route is matched and whether or not we should tag this route as part of our visible navigation (`nav:true`). After we configure our routes, we then call `buildNavigationModel` which takes the route info, and builds a special collection that we can data-bind to for display as a top-level navigation UI. Finally, we activate the router. All of this takes place inside a function called `activate`. Every time Durandal presents a component on screen, it will look for an optional `activate` callback. If present, it will invoke it prior to data-binding. This allows modules to execute custom activation code, such as configuring the application's router in this case.

Once again, it's easiest to understand if you look at the module side-by-side with it's view. If you do that, you will first see how we are data-binding to the `navigationModel` property in order to generate a navbar. Each navigable route is turned into an `li` with a link that is bound to the route's `hash` and `title`. As part of the navbar, we also bind an animating spinner icon to the router's `isNavigating property`. As a result, whenever we are in the process of navigating from one page to another, the spinner will be visible and animating.

At the bottom of the view is a special `router` binding which connects to our router in the module. This serves as a placeholder where the current "page" will be displayed. The `transition` property indicates that whenever the page changes, Durandal should use the "entrance" transition animation.

Go ahead and run it again. It looks pretty similar to before, except now there's a navbar. It's not very impressive because we still only have one page. Let's create a second page so we can navigate back and forth.

#### Mount Rainier

Let's create a second page that calls Flickr and gets back a bunch of pictures to display of Mount Rainier. Our first step is to add another route. Update your shell's router config so that it has these two routes now:

```javascript
{ route:'', title:'Home', moduleId:'home', nav:true },
{ route:'rainier', title:'Mount Rainier', moduleId:'rainier', nav:true }
```

That's our original, default home route, plus our new route for the page we are about to add. By now, I hope you see the pattern emerging. We create a module and a view for our new page.

**rainier.js**
```javascript
define(function (require) {
  var http = require('plugins/http'),
      ko = require('knockout');

  var url = 'http://api.flickr.com/services/feeds/photos_public.gne';

  var qs = { 
    tags: 'mount ranier', 
    tagmode: 'any', 
    format: 'json' 
  };

  return {
     images: ko.observableArray([]),
     activate: function () {
       var that = this;
       if (this.images().length > 0) {
           return;
       }
     
       return http.jsonp(url, qs, 'jsoncallback').then(function(response) {
          that.images(response.items);
       });
     }
   };
});
```

**rainier.html**
```html
<section>
  <h2>Mount Rainier</h2>
  <div class="row-fluid">
    <ul class="thumbnails" data-bind="foreach: images">
      <li>
         <img style="width: 260px; height: 180px;" data-bind="attr: { src: media.m }"/>
      </li>
    </ul>
  </div>
</section>
```

I bet you can figure out how this works. Our module uses the http plugin to call the Flickr api in its activate callback. It then stores that data in it's `images` observable array property. The view simply binds to that array of data.

If you run the app now, you'll see two items in the navbar and you'll be able to navigate back and forth between them. You can also use the browser's back button. There's lots more details and tons more that Durandal can do. At this point, you might want to download the original starter kit and take a look at it in more detail to see a few more interesting tidbits. You'll probably also want to download the official samples to see how other features work, like pub/sub messaging, custom modal dialogs, widgets, advanced view composition and more.

Durandal makes building rich, dynamic JavaScript apps simple by encouraging a modular approach. It's no surprise that our community is growing so fast. Please join our google group to ask questions and share your experiences with other developers. Most importantly, use Durandal to create something. We hope you deeply enjoy the experience.
