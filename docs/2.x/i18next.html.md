---
title: Docs - Localization with i18next
layout: docs
tags: ['docs','integration','localization']
---
# Localization with i18next
#### 

Here's how [i18next](http://i18next.com/) describes itself:

> i18next is a full-featured i18n javascript library for translating your webapplication. It runs in browser, under node.js, rhino and other javascript runtimes.

To set up localization of your app, first download [i18next](http://i18next.com/) and add it into your project's scripts folder. Then configure RequireJS to find the library. Do this by adding a path entry to your requirejs.config in main.js:

```javascript
requirejs.config({
	paths: {
		...
	    'i18next':'../lib/i18next/i18next.amd.withJQuery-1.7.0' //this should point to where you placed the library
	    ...
    }
});
```

Next, you will need to import the library and build your i18next configuration object in your main.js module:
```javascript
define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'durandal/binder', 'i18next'], function (system, app, viewLocator, binder, i18n) {
	var i18NOptions = { 
		detectFromHeaders: false,
		lng: window.navigator.userLanguage || window.navigator.language || 'en-US',
		fallbackLang: 'en',
        ns: 'app',
        resGetPath: 'locales/__lng__/__ns__.json',
        useCookie: false
    };

    ...
}
```

> **Note:** This example uses the window.navigator language to set the default language. You can change this using a different client side or server side approach.

Now initialize i18next inside your app.start method in the main.js. Notice that the initialization function uses a callback. This is where you hook into Durandal's binder and tell i18next to parse your markup and convert any resource lookups into strings. It uses jQuery to traverse the DOM and find any 'data-i18n' attributes and look up the string in the resource files for the configured language or in the fallback languages.

```javascript
app.start().then(function () {
    i18n.init(i18NOptions, function () {
        //Call localization on view before binding...
        binder.binding = function (obj, view) {
            $(view).i18n();
        };

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('shell', 'entrance');
    });
});
```

You are now ready to localize the application. First you need to create your resource files. There are many options in i18next to handle this. For this example we have established the namespace in the configuration object to be 'app' and created a locales folder at the root of the website. The location of the resources is defined in the configuration object. Notice that the file name starts with the namespace: 'app' is our namespace and 'app.json' is the file name.  You can read up more about how this works on the [i18next](http://i18next.com/pages/doc_init.html) site.

In each folder in your locales you create a JSON file that has key-value pairs. Here is an example:

```javascript
{
    "modules" : {
        "localization": {
            "title" : "Localization",
            "modal" : "Modal localized",
            "modalDialog" : "Modal Dialog localized",
            "clickToShowModal" : "Click the button below to show the localized modal dialog",
            "showModalBtn" : "Show Custom Modal localized",
            "yourAnswer": "You answered \"__response__\".",
            "youAnswered":"You answered...",
            "colorMsgTitle": "Color",
            "favoriteColorQuestion" : "What is your favorite color?",
            "confirmColorMsg" : "Are you sure that is your favorite color?",
            "justCheckingTitle" : "Just Checking..."
        }
    }
}
```

Now let's see how we use the resources in code. In code you import i18next and use it to return the localized string. Here is an example of how you might set up a localized route title. You just call the `t()` function passing a string that defines the path to the resource key. The function returns the localized string.

```javascript
{
	type: 'intro',
	title: i18n.t('app:modules.localization.modal'),
	route: '',
	moduleId: 'default/index'
 }
```

In markup you add the `'data-i18n'` attribute and set its value to a string that defines the path to the resource key. When the Durandal binder binds the view and the viewmodel we call i18next method passing the view object. i18next traverses the DOM and looks up the localized strings in the resource files. Here is an example of the markup.

```html
<div>
    <h2 data-i18n="app:modules.localization.clickToShowModal"></h2>
    <button class="btn" data-bind="click:showCustomModal" data-i18n="app:modules.localization.showModalBtn"></button>
</div>
```

You can download the dFiddle fork with this implemented at [https://github.com/anwalkers/dFiddle-2.0](https://github.com/anwalkers/dFiddle-2.0) or see the dFiddle in action at [http://anwalkers.github.io/dFiddle-2.0/#localization](http://anwalkers.github.io/dFiddle-2.0/#localization).