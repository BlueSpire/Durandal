---
title: Docs - View Engine
layout: docs
tags: ['docs','view engine','reference']
---
# View Engine
#### 

> The _viewEngine module_ provides information to the _viewLocator module_ which is used to locate the view's source file. The _viewEngine_ also transforms a view id into a view instance.

Here are the basic properties and functions:

* `viewExtension` - The file extension that view source files are expected to have.
* `viewPlugin` - The name of the RequireJS loader plugin used by the _viewLocator_ to obtain the view source. (Use requirejs to map the plugin's full path).
* [overridable](/documentation/Overridable) `function isViewUrl(potential):bool` - Returns true if the potential string is a url for a view, according to the view engine.
* [overridable](/documentation/Overridable) `function convertViewUrlToViewId(url):string` - Converts a view url into a view id.
* [overridable](/documentation/Overridable) `function convertViewIdToRequirePath(viewId):string` - Converts a view id into a full RequireJS path.
* [overridable](/documentation/Overridable) `function parseMarkup(markup):domElement` - Parses some markup and turns it into a dom element.
* [overridable](/documentation/Overridable) `function createView(viewId):promise` - Returns a promise for a dom element identified by the _viewId_ parameter.

> **Note:** View engines are expected to be written as RequireJS loader plugins so that the view "compilation" can be done both in the browser at debug time, and as part of the optimization process. To create a custom view engine, you implement it according to RequireJS specifications for a loader plugin, then in your main module you require the _viewEngine_ module and set it's _viewExtension_ and _pluginPath_ variables to point to your implementation. By default, the _text_ plugin is used to load standard html views.