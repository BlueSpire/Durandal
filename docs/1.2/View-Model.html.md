---
title: Docs - View Model
layout: docs
tags: ['docs','view model','reference']
---
# View Model
#### 


> The _viewModel_ module contains functionality designed to assist in advanced screen state scenarios. It implements the *Screen Activator* pattern. 

This module has the following API:

1. `function activator([initialActiveItem, settings]) : activator` - This creates a computed observable which enforces a _lifecycle_ on all values the observable is set to. When creating the activator, you can specify an _initialActiveItem_ to activate. You can also specify a _settings_ object. Use of the settings object is for advanced scenarios and will not be detailed much here.

2. `defaults` - A property which is the home to some basic settings and functions that control how all activators work. These are used to create the instance _settings_ object for each activator. They can be overriden on a per-instance-basis by passing a settings object when creating an activator or by accessing the settings property of the activator. To change them for all activators, change them on the _defaults_ property. The two most common customizations are presented below. See the source for additional information.
    * [overridable](/documentation/Overridable) `function interpretResponse(value) : bool` - Interprets values returned from guard methods like _canActivate_ and _canDeactivate_ by transforming them into bools. The default implementation translates string values "Yes" and "Ok" as true...and all other string values as false. Non string values evaluate according to the truthy/falsey values of JavaScript. Replace this function with your own to expand or set up different values. This transformation is used by the activator internally and allows it to work smoothly in the common scenario where a deactivated item needs to show a message box to prompt the user before closing. Since the message box returns a promise that resolves to the button option the user selected, it can be automatically processed as part of the activator's guard check.
    * [overridable](/documentation/Overridable) `function areSameItem(currentItem,  newItem, activationData) : bool` - When the activator attempts to activate an item as described below, it will only activate the new item, by default, if it is a different instance than the current. Overwrite this function to change that behavior.

### Lifecycle

The activator enforces a lifecycle on all it's values. Other than that, it operates like a standard observable. Below is an explanation of the lifecycle events you can hook into for advanced screen scenarios. To participate in the lifecycle, implement any (or none) of the functions below on the object that you set the activator to:

* `function canActivate() : bool/promise` - Adding this function allows you to tell the activator whether or not it can be set to this value at the current time. You can return a bool value, for a synchronous response, or a promise that resolves to a bool, for an asynchronous check. 

* `function activate() : undefined/promise` - Adding this function allows the activator to call back into the value when it has been successfully set. You can optionally return a promise to tell the activator when your async activation logic has completed.

* `function canDeactivate(isClose) : bool/promise` - Before the value of the activator is changed to a new value, the current value can reject the switch. To do this, implement this function. Return a bool if the logic is synchronous or a promise for asynchronous checking. The _isClose_ parameter tells you whether or not the activator is merely switching to another object, or trying to permanently release the instance.

* `function deactivate(isClose)` - When the value of the activator is switched to a new value, before the switch occurs, it has the opportunity to clean up after itself. To time into this, implement _deactivate_. The _isClose_ parameter is the same as above.

### Activator API
Besides functioning as an observable and enforcing the above mentioned lifecycle, the activator exposes an API. This API centers around the lifecycle:

* `observable isActivating()` - This observable is set internally by the activator during the activation process. It can be used to determine if an activation is currently happening.

* `function canDeactivateItem(item, close) : promise` - Pass a specific item as well as an indication of whether it should be closed, and this function will tell you the answer.

* `function deactivateItem(item, close) : promise` - Deactivates the specified item (optionally closing it). Deactivation follows the lifecycle and thus only works if the item can be deactivated.

* `function canActivateItem(item [, activationData]) : promise` - Determines if a specific item can be activated. You can pass an arbitrary object to this function, which will be passed to the item's _canActivate_ function , if present. This is useful if you are manually controlling activation and you want to provide some context for the operation.

* `function activateItem(item [, activationData]) : promise` - Activates a specific item. Activation follows the lifecycle and thus only occurs if possible. _activationData_ functions as stated above.

* `function canActivate() : promise` - Checks whether or not the activator itself can be activated...that is whether or not it's current item or initial value can be activated.

* `function activate() : promise` - Activates the activator...that is..it activates it's current item or initial value.

*  `function canDeactivate(close) : promise` - Checks whether or not the activator itself can be deactivated...that is whether or not it's current item can be deactivated.

* `function deactivate(close) : promise` - Deactivates the activator...interpreted as deactivating its current item.

* `function includeIn(model)` - Adds _canActivate_, _activate_, _canDeactivate_ and _deactivate_ functions to the provided model which pass through to the corresponding functions on the activator.

* `function forItems(items)` - Sets up a collection representing a pool of objects which the activator will activate. See below for details. Activators without an item bool _always close their values on deactivate_. Activators with an items pool only deactivate, but do not close them.

### Activating from a Collection
When you call `forItems` the activator's behavior changes slightly. In this case, any item which is activated is added to the collection, if not already present. If an item is deactivated, without a new one set, the activator selects the next item in the collection to activate. Finally, this is the scenario in which you can deactivate without closing. When a new item is set, it is activated. The previous item is deactivated, but it is not closed. To close an item in this scenario, an explicit API call to the activator must be made.