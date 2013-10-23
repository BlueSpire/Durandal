---
title: Docs - KendoUI
layout: docs
tags: ['docs','integration']
---
# KendoUI
#### 

Here's how [KendoUI](http://www.kendoui.com/) describes itself:

> Kendo UI is everything professional developers need to build HTML5 sites and mobile apps. Today, productivity of an average HTML/jQuery developer is hampered by assembling a Frankenstein framework of disparate JavaScript libraries 
and plug-ins. Kendo UI has it all: rich jQuery-based widgets, a simple and consistent programming interface, a rock-solid DataSource, validation, internationalization, a MVVM framework, themes, templates and the list goes on.

Since KenoUI has its own databinding framework, we need to do a little configuration to enable it to integrate into Durandal as well as Knockout does.


> **Note:** If you are using [Knockout-Kendo](http://rniemeyer.github.io/knockout-kendo/) bindings, rather than native KendoUI bindings, you should **NOT** use the following configuration. It only applies if you wish to use KendoUI bindings for KendoUI's controls and Knockout bindings for everything else.

Here are the steps to get things working:

1. In your main.js, before calling _setRoot_, add this line of code: 
```javascript
kendo.ns = "kendo-";
```
Doing this will allow Knockout to distinguish its bindings as `data-bind` and KendoUI to distinguish its bindings as `data-kendo-bind`.

2. Immediately after that, add the following configuration for the binder:
```javascript
binder.binding = function (obj, view) {
     kendo.bind(view, obj.viewModel || obj);
};
```
This bit of code automatically applies KendoUI bindings any time Durandal's binder is called.

3. Finally, use `data-bind` for normal bindings in your views and `data-kendo-bind` for KendoUI controls.