---
title: Docs - Widget Reference
layout: docs
tags: ['docs','widgets','reference']
---
# Widget
#### 

> The widget module encapsulates the functionality which enables bindable, skinnable and templatable widgets. Its capabilities are normally leveraged via the knockout widget binding. 

There are some APIs which are worth mentioning independent of creating and binding:

* `function create(element, settings [, bindingContext])` - Use this function to create a widget through code. The _element_ should reference a dom element that the widget will be created on. The _settings_ can be either a string or an object. If it's a string, it should specify the widget kind. If it's an object, it represents settings that will be passed along to the widget. This object should have a _kind_ property used to identify the widget kind to create. Optionally, you can specify a _bindingContext_ of which you want the widget's binding context to be created as a child.

* `function registerKind(kind)` - By default, you can create widgets in html by using the _widget_ binding extension. Calling _registerKind_ allows you to easily create a custom binding handler for your widget kind. Without calling _registerKind_ you might declare a widget binding for an expander control with `data-bind="widget:{kind:'expander', items: myItems}"` But if you make the following call `widget.registerKind('expander')` then you can write the binding expression as `data-bind="expander:{items: myItems}"`

* `function mapKind(kind [, viewId, moduleId])` - Use this to re-map a widget kind identifier to a new viewId or moduleId representing the 'skin' and 'behavior' respectively.

* `function getParts(elements) : object` - Developers implementing widgets may wish to use this function to acquire the resolved template parts for a widget. Pass a single dom element or an array of elements and get back an object keyed by part name whose values are the dom elements corresponding to each part in that scope.

The widget module follows a very simple convention for mapping widget kinds to modules and views. It assumes the presence of a widgets folder at the root of your project and that there is a single folder per widget, named according to the kind. Inside that folder, it assumes the presence of a controller.js module that should be bound to a view.html file. The widget module allows you to easily change this convention, by replacing any of two functions that control this behavior:

* [overridable](/documentation/Overridable) `function convertKindToModuleId(kind) : string` - Replace this to re-interpret the kind id as a module path. By default it does a lookup for any custom maps added through _mapKind_ and then falls back to the path `"durandal/widgets/{kind}/controller"`.

* [overridable](/documentation/Overridable) `function convertKindToViewId(kind) : string` - Replace this to re-interpret the kind id as a view id. The default does a lookup for any custom maps added through _mapKind_ and then falls back to the path `"durandal/widgets/{kind}/view"`.