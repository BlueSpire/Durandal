---
title: Docs - Creating a Widget
layout: docs
tags: ['docs','widgets','how to']
---
# Creating a Widget
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
        Durandal supports creating skinnable, templatable, data-binding enabled widgets by installing the widget plugin.
    </li>
    <li>
        Create widgets by adding viewmodel.js and view.html files at App/widgets/{your-widget-name}.
    </li>
    <li>
        Leverage part templating by adding _data-part_ attributes to replacable sections of your widget's view.
    </li>
    <li>
        Use the _widget_ binding handler to instantiate a widget. (Or call registerKind to create a custom handler.)
    </li>
  </ul>
</blockquote>

### Getting Set Up

In this tutorial we will learn how to create a very simple widget and explore some of the APIs provided to help in the most common scenarios. Code related to this tutorial can be found in the repo in the appropriate locations as described below. Let's create a very simple _Expander_ widget.

In order to leverage Durandal's default widget support we need to install the plugin and organize our widget code in a particular way. First, let's install the plugin. Here's what your _main.js_ might look like:

```javascript
define(['durandal/app'],  function (app) {
    app.configurePlugins({
        widget: true
    });

    app.start().then(function () {
        app.setRoot('shell');
    });
});
```

If you don't already have one, create a directory under the app directory called "widgets". Durandal's default is to look in this location for all widget implementations. Next, add a subdirectory named "expander". Again, Durandal expects there to be a folder per widget inside the "widgets" folder. This keeps code nicely organized and predictable. Finally, let's add two files to the expander folder: viewmodel.js and view.html. These two files will make up your actual implementation.

> **Note:** Don't like any of the conventions detailed above? No problem. See the [reference documentation](/documentation/api#module/widget) on widgets for APIs used to change these conventions globally as well as on a per widget basis.

Your folder structure should now look like this:

* app
    * widgets
        * expander
            * viewmodel.js
            * view.html

viewmodel.js is a function exported module that will serve as a location for all your widget's code. It will be bound to view.html by the widget infrastructure via the [composition module](/documentation/api#module/composition). Following is the source code list for these two modules which we will then explain piece by piece:

**view.html**
```html
<div class="accordion" data-bind="foreach: { data: settings.items, afterRender: afterRenderItem }">
  <div class="accordion-group">
    <div class="accordion-heading">
      <a data-part="headerContainer" class="accordion-toggle">
        <div data-part="header" data-bind="html: $parent.getHeaderText($data)"></div>
      </a>
    </div>
    <div class="accordion-body collapse in">
      <div class="accordion-inner" data-part="itemContainer" >
        <div data-part="item" data-bind="compose: $data"></div>
      </div>
    </div>
  </div>
</div>
```

**viewmodel.js**
```javascript
define(['durandal/composition','jquery'], function(composition, $) {
    var ctor = function() { };

    ctor.prototype.activate = function(settings) {
        this.settings = settings;
    };

    ctor.prototype.getHeaderText = function(item) {
        if (this.settings.headerProperty) {
            return item[this.settings.headerProperty];
        }

        return item.toString();
    };

    ctor.prototype.afterRenderItem = function(elements, item) {
        var parts = composition.getParts(elements);
        var $itemContainer = $(parts.itemContainer);

        $itemContainer.hide();

        $(parts.headerContainer).bind('click', function() {
            $itemContainer.toggle('fast');
        });
    };

    return ctor;
});
```

### How the View Works
Looking at the view implementation first, we can see that we have a pretty straight forward knockout-bound view. This is a simple expander implementation which consists of a _div_ wrapping an _a_ for every header and another _div_ for each content. The root _div_ leverage's KO's _foreach_ binding to bind a list of items, providing the _afterRenderItem_ hook as well. The header implementation leverages a $parent binding to jump out of the _foreach_ scope and call a custom function on the viewmodel, used to determine the header's text, based on the item bound. Finally, each item's content is displayed using Durandal's _compose_ binding. This is all standard knockout and Durandal code which you would use to build any view. There's one unique thing about this markup you need to understand. I'm pretty sure you noticed it. It's the presence of the _data-part_ attributes. This is what enables per-use templating. Simply mark any part of the view you wish to be customizable with a _data-part_ attribute set to a unique name (unique in this widget, not globally). At code time, a developer will be able to specify replacement parts for any aspect of the view you have tagged in this way. 

### How the ViewModel Works
ViewModel modules always export the widget's constructor function. The widget infrastructure will always invoke this function with _new_ when the widget is being created. The composition infrastructure will also call activate, as usual, but will pass it the _settings_ that have been specified for the widget. In this case, we have chosen to keep a reference to the settings object so that we can bind it in the view. If you look back at the view, you will see that we have done just that, binding to an expected list of items to generate expanders for. The view's default "header" template also calls into the view model, invoking its _getHeaderText_ function. This function checks the settings to see if a specific property has been specified for the header text, or falls back to a _toString_ call. Finally, we have the _afterRenderItem_ callback which was specified in the view's _foreach_ binding. This is invoked when the _foreach_ creates elements for an item. Knockout provides an array of _elements_ as well as a reference to the _item_ that was bound. This is where things get interesting. Here, we use the [composition module's](/documentation/api#module/composition) [getParts](/documentation/api#module/composition/method/getParts) function to obtain a keyed object pointing to all the templated parts present in the list of elements. This API is important because it handles lookups based within a scoped set of elements and understands the template part mechanism. Once the object is returned, we use some simple jQuery to add basic behavior to those parts.

That's all there is to creating a re-usable widget.

> **Note:** In some cases, your widget may not actually need a view. Perhaps it's just adding some jQuery behavior or applying an existing jQuery plugin to a dom element. In this case, you are better off implementing a [custom Knockout binding handler](http://knockoutjs.com/documentation/custom-bindings.html).

### Using a Widget

Once you've gone through the trouble of creating a widget, you are going to want to use it somewhere. The most common way to use a widget is through the _widget_ binding. To use our expander widget to display a theoretical list of "projects" we would write the following html.

**A view bound to a model with a projects property...**
```html
<div>
    <h1>Widgets Sample</h1>
    <div data-bind="widget: {kind:'expander', items:projects, headerProperty:'name'}">/div>
</div>
```

You can make this a little nicer by calling the [widget module's](/documentation/api#module/widget) [registerKind](/documentation/api#module/widget/method/registerKind) function like so:

`widget.registerKind('expander')`

You should do this in your application startup. Then you can write html like this:

**A view bound after calling registerKind...**
```html
<div>
    <h1>Widgets Sample</h1>
    <div data-bind="expander: {items:projects, headerProperty:'name'}">/div>
</div>
```

As an alternative, you can also alter your plugin configuration to automatically register certain widget kinds. Here's what that would look like:

```javascript
define(['durandal/app'],  function(app) {
    app.configurePlugins({
        widget: {
            kinds: ['expander']
        }
    });

    app.start().then(function () {.
        app.setRoot('shell');
    });
});
```

Now, let's suppose that instead of displaying a simple property for the header, we actually want to have some custom html to replace the default header part. Here's how we would do that:

**A widget with a templated part override...**
```html
<div>
    <h1>Widgets Sample</h1>
    <div data-bind="expander:{items:projects}">
        <h2 data-part="header">Project: <span data-bind="text: name"></span></h2>
    </div>
</div>
```

We can override any part this way. We simply add child elements to the widget's element, each with a _data-part_ attribute, referencing the part we wish to override. One final thing to note is that each templated part override's binding scope is parented to the surrounding view's scope. This allows a templated part to use $root to access the containing view's view model.

For further information on widget APIs which can be used to create or customize widgets, see the [reference documentation](/documentation/api#module/widget). You can find a working implementation of the above widget under source. Run it via the widgets sample.