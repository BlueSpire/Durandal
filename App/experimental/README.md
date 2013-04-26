# WARNING

The modules in this folder are experimental. Their API is not solid, they may not be proven in the real world, they may disappear without warning, etc. There will be no documentation for these modules until they become part of the main project (if they do at all).

* **observable.js** - This module can be used to convert normal properties to observable properties on an object without needing to use ko.observable or ko.observableArray. It can also convert an entire object. The result is an object with get/set semantics so that observables can be used with normal JS attributes rather than functions. This module has an `install` function which attaches it into Durandal's view model binder and converts objects automatically just before they are bound to the view. It requires >= IE9 or any other modern browser.

* **serializer.js** - This module uses the JSON functionality of the browser, but plugs in a system of registering and restoring prototype-based versions of previously serialized objects. It's also configured to not serialize know durandal properties.