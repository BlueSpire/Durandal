---
title: Docs - View Model Binder
layout: docs
tags: ['docs','view model binder','reference']
---
# View Model Binder
#### 

> The _viewModelBinder module_ is used any time the framework needs to bind a view to an object. Usually this happens through using the _composition module_. 

This module exports the following functions:

* `function bind(obj, view)` - Databinds _obj_, which can be an arbitrary object, to _view_ which is a dom sub-tree. If _obj_ has a function called _beforeBind_, then it is called prior to binding. If _obj_ has a function called _afterBind_, then it is called following binding. Both functions are passed the view.

* `function bindContext(bindingContext, view [, obj])` - Applies bindings to a _view_ using a pre-existing _bindingContext_. This is used by the composition module when a view is supplied without a model. It allows the parent binding context to be preserved. If the optional _obj_ parameter is supplied, a new binding context will be created that is a child of _bindingContext_ with its model set to _obj_. This is used by the widget framework to provide the widget binding while allowing templated parts to access their surrounding scope.

> **Note:** Both the above APIs add helpful logging and debugging support while the framework is in debug mode.
If you wish the errors to be reported as such, rather than logged, set `viewModelBinder.throwOnErrors = true;`.

* [overridable](/documentation/Overridable) `function beforeBind(obj, view)` - Called before every binding operation. Does nothing by default.

* [overridable](/documentation/Overridable) `function afterBind(obj, view)` - Called after every binding operation. Does nothing by default.