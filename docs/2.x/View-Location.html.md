---
title: Docs - View Location & Customization
layout: docs
tags: ['docs','view locator','reference']
---
# View Location &amp; Customization
#### 

> The [viewLocator module](/documentation/api#module/viewLocator) collaborates with the [viewEngine module](/documentation/api#module/viewEngine) to provide views (literally dom sub-trees) to other parts of the framework as needed. The primary consumer of the [viewLocator](/documentation/api#module/viewLocator) is the [composition module](/documentation/api#module/composition).

During composition, the framework calls into the [viewLocator](/documentation/api#module/viewLocator) to obtain a view to render the current object with. It does this by calling [viewLocator.locateViewForObject](/documentation/api#module/viewLocator/method/locateViewForObject). Here's what that does:

1. First, the object is checked for a member function named _getView_. If this function exists, it is invoked and the object is given the opportunity to explicitly provide either a constructed DOM to be used as the view or a _string_ to be interpreted as the view url/id. The result is passed to [locateView](/documentation/api#module/viewLocator/method/locateView) which then either returns the DOM element or requires the view using its id and returns that. The _getView_ method is not used in typical application scenarios. It exists for highly specialized scenarios where an object may need "one-off" control in determining which view to create or how the view should be created.

2. If there is no _getView_ function, or if it returns null/undefined, then the object is inspected for a _viewUrl_ property. If found, it is passed to [locateView](/documentation/api#module/viewLocator/method/locateView) and processing continues as above to ultimately return a DOM element. Again, usage of this is expected to be rare.

3. If neither of the above explicit view declarations is found, then a convention is applied. This is the expected normative use. The first convention is to get the module's id. Durandal hooks into RequireJS and stores this information for all module instances. The module id is then passed to [locateView](/documentation/api#module/viewLocator/method/locateView) which transforms it into a view id and returns the DOM sub-tree as described above. This allows for a very simple naming convention for view models and views. For example, a module named _editCustomer.js_ will map to _editCustomer.html_.

4. If no module id is found, then an attempt is made to determine the object's type by examining its constructor. This type name is then mapped to a views folder and passed to the [locateView](/documentation/api#module/viewLocator/method/locateView) function so processing can finish. This would mean that an object with a constructor named Customer would have a view url of _views/customer.html_. This is a last resort attempt to determine the view by convention and is not expected to be used normally.

The _viewLocator_ allows for a very simple pattern of creating a module per view model or model and a corresponding view per module. Naturally, by using the _composition module_ view resolution behavior can be customized in a variety of ways, but you may also want to customize the view locator directly with your own general mapping convention. There are three functions exported by the _viewLocator_ which you can replace with your own logic in order to accomplish this:

* [convertModuleIdToViewId](/documentation/api#module/viewLocator/method/convertModuleIdToViewId) - This function does nothing by default which is why _editCustomer.js_ is mapped to _editCustomer.html_ (both have the same underlying id of _editCustomer_). Replace this function with your own implementation to easily create your own mapping logic based on _moduleId_.

* [determineFallbackViewId](/documentation/api#module/viewLocator/method/determineFallbackViewId) - As mentioned above, if no view id can be determined, the system falls back to attempting to determine the object's "type" and then uses that. This function contains the implementation of that fallback behavior. Replace it if you desire something different. Under normal usage however, this function should not be called.

* [translateViewIdToArea](/documentation/api#module/viewLocator/method/translateViewIdToArea) - When a view area is specified, it along with the requested view id will be passed to this function, allowing you to customize the path of your view. You can specify area as part of the [locateViewForObject](/documentation/api#module/viewLocator/method/locateViewForObject) or [locateView](/documentation/api#module/viewLocator/method/locateView) calls, but more commonly you would specify it as part of a compose binding. Any compose binding that does not include a model, but only a view, has a default area of 'partial'. That said, the default implementation of this function does no area translation.