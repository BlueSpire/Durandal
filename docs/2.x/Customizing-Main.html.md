---
title: Docs - Customizing Main
layout: docs
tags: ['docs', 'customization']
---
# Customizing Main
#### 

> In _main.js_ you configure both RequireJS and Durandal. There are a variety of different approaches you may wish to take, based on your project and team culture.

### Handling 3rd Party Libraries

There are two basic strategies for handling 3rd party libraries. The simplest strategy is to include them in your _index.html_ page (probably minified and combined) and then include your _require.js_ reference last. The second option is to pipe all your libraries through RequireJS. This requires a bit more experience with AMD, path and shim config.

#### Keeping Libraries Global

As mentioned above, this technique is simplest. To configure a project this way, use your standard script referencing, minimizing and combining techniques. Be sure to include all 3rd party scripts before the reference to require.js. Then, in your _main.js_ file, you need to inform the module system about jQuery and Knockout, since Durandal expects those to be defined as AMD modules (which they will not be if loaded this way). This is easy enough by adding the following two lines of JavaScript after your RequireJS configuration, but before your main module's define.

```javascript
define('jquery', function () { return jQuery; });
define('knockout', ko);
```

#### AMD-ify All Libraries

Another option is to place only the RequireJS script reference in your index.html page and then use RequireJS to load up all 3rd party libraries. This technique has advantages of cleaning up global scope and possibly improving first-time app loading. However, it is more involved and sometimes can be...unpleasant if you are working with libraries that aren't built for AMD but are dependent on libraries that are. You should make sure you are significantly comfortable with RequireJS [path and shim config](http://requirejs.org/docs/api.html#config-shim) before attempting this approach.

### Configuring Plugins

As part of your main configuration, you are going to want to decide which plugins to install. There is one particular plugin I want to highlight here: the [observable](/documentation/api#module/observable) plugin. There are great benefits to using this plugin, but you must understand that when you do so, you will not be able to run your app in a non-ES5 browser. Installing this plugin will change the way you write your code and there is no way to gracefully fallback. See the docs on [binding plain JavaScript Objects](/documentation/Binding-Plain-Javascript-Objects) for more information.

### View Location and Project Structure

The [viewLocator](/documentation/api#module/viewLocator) has an API called [useConvention](/documentation/api#module/viewLocator/method/useConvention). This allows you to set up a very basic naming replacement between module ids and view paths. For example, if you did this: `viewLocator.useConvention('viewmodels', 'views');` then when the view locator attempted to conventionally find a view for a module with id _viewmodels/customer_ it would map it to _views/customer_. A wide range of developers prefer to organize their code into _viewmodels_ and _views_ folders, so you can actually achieve this with the following `viewLocator.useConvention();`.

While the above convention may be nice for smaller projects, we have found that it doesn't scale as well to larger projects. In this case, it is more beneficial to organize your code by application features, rather than technical category. Still, in other cases, you may need much more advanced control over view location than is provided by the simple [useConvention](/documentation/api#module/viewLocator/method/useConvention) API. Don't worry, you have complete control. For information on this, have a read through [View Location &amp; Customization](/documentation/View-Location).