---
title: Docs - View Locator
layout: docs
tags: ['docs','view locator','reference']
---
# View Locator
#### 

> The _viewLocator module_ collaborates with the _viewEngine module_ to provide views (literally dom sub-trees) to other parts of the framework as needed. The primary consumer of the _viewLocator_ is the _composition module_.

There are a few basic functions the _viewLocator_ exports.

* `useConvention(modulesPath, viewsPath, areasPath)` - Allows you to set up a convention for mapping module folders to view folders. _modulesPath_ is a string in the path that will be replaced by _viewsPath_. Partial views will be mapped to the "views" folder unless an _areasPath_ is specified.
All parameters are optional. If none are specified, the convention will map modules in a "viewmodels" folder to views in a "views" folder.

* `function locateView(viewOrUrlOrId [, area, elementsToSearch]) : promise` - The _viewOrUrlOrId_ parameter represents a url/id for the view. The file extension is not necessary (ie. .html). When this function is called, the _viewEngine_ will be used to construct the view. The _viewEngine_ is passed the finalized id and returns a constructed DOM sub-tree, which is returned from this function. If the _viewOrUrlOrId_ is not a _string_ but is actually a DOM node, then the DOM node will be immediately returned. Optionally, you can pass an _area_ string and it along with the url will be passed to the view locator's _translateViewIdToArea_ before constructing the final id to pass to the view engine. If you provide an array of DOM elements for _elementsToSearch_, before we call the view engine, we will search the existing array for a match and return it if found.

* `function locateViewForObject(obj [, elementsToSearch]) : promise` - This function takes in an object instance, which it then maps to a view id. That id is then passed to the _locateView_ function and it is processed as above. If _elementsToSearch_ are provided, those are passed along to _locateView_. Following is a description of how _locateViewForObject_ determines the view for a given object instance.


> **Note:** Both of the functions above return a _promise_ for the view, since location of the view may be an asynchronous operation.

1. First, the object is checked for a member function named _getView_. If this function exists, it is invoked and the object is given the opportunity to explicitly provide either a constructed dom to be used as the view or a _string_ to be interpreted as the view url/id. The result is passed to _locateView_ and processing continues as above. This method is not typically used. It exists for highly specialized scenarios where an object may need "one-off" control in determining which view to create or how the view should be created.

2. If there is no _getView_ function, or if it returns null/undefined, then the object is inspected for a _viewUrl_ property. If found, it is passed to _locateView_ and processing continues as above. Again, usage of this is expected to be rare.

3. If neither of the above explicit view declarations is found, then a convention is applied. This is the expected normative use. The first convention is to inspect the object for a \__moduleId\__ property. Durandal hooks into RequireJS and adds this property to all module instances. If the module is a function, then it is added to its prototype. The module id is then passed to _locateView_ which transforms it into a view id and returns the dom sub-tree as described above. This allows for a very simple naming convention for view models and views. For example, a module named _editCustomer.js_ will map to _editCustomer.html_.

4. If no \__moduleId\__ property is found, then an attempt is made to determine the object's type by examining it's constructor. This type name is then mapped to a views folder and passed to the _locateView_ function so processing can finish. So, this would mean that an object with a ctor named Customer would have a view url of _views/customer.html_. This is a last resort attempt to determine the view by convention and is not expected to be used normally.

The _viewLocator_ allows for a very simple pattern of creating a module per view model or model and a corresponding view per module. Naturally, by using the _composition module_ view resolution behavior can be customized in a variety of ways, but you may also want to customize this module directly with your own general mapping convention. There are three functions exported by the _viewLocator_ which you can use to easily do this.

* [overridable](/documentation/Overridable) `function convertModuleIdToViewId(moduleId) : string` - This function does nothing by default which is why _editCustomer.js_ is mapped to _editCustomer.html_ (both have the same underlying id of _editCustomer_). Replace this function with your own implementation to easily create your own mapping logic based on _moduleId_.

* [overridable](/documentation/Overridable) `function determineFallbackViewId(obj) : string` - As mentioned above, if no view id can be determined, the system falls back to attempting to determine the object's type and then uses that. This function contains the implementation of that fallback behavior. Replace it if you desire something different. Under normal usage however, this function should not be called.

* [overridable](/documentation/Overridable) `function translateViewIdToArea(viewId, area) : string` - When a view area is specified, it along with the requested view id will be passed to this function, allowing you to customize the path of your view. You can specify area as part of the _locateView_ call, but more commonly you would specify it as part of a compose binding. Any compose binding that does not include a model, but only a view, has a default area of 'partial'.