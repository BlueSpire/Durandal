---
title: Docs - Using Activators
layout: docs
tags: ['docs','view model','reference']
---
# Using Activators
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>The router and dialog plugins use activators internally.</li>
    <li>
        The [activator module](/documentation/api#module/activator) contains functionality designed to assist in advanced screen state scenarios.
    </li>
    <li>Activators implement the *Screen Activator* pattern. Use an activator whenever you need to enforce the Activation Lifecycle.</li>
  </ul>
</blockquote>

### Creating an Activator

To create an activator, require the [activator module](/documentation/api#module/activator) and call the [create](/documentation/api#module/activator/method/create) method. An activator is just a computed observable with special behavior. The details of its API can be found [here](/documentation/api#module/activator/class/Activator).

Here's an example UI that models a screen with activatable content:

```javascript
var screen = {
	content:activator.create(),
	sidebar:ko.observable(),
	openDocument:function(docModel){
		this.content.activateItem(docModel)
	},
	showEditor:function(editorModel){
		this.sidebar(editorModel);
	}
};
```

In this example, any time the content is changed, through calls to [activateItem](/documentation/api#class/Activator/method/activateItem), the activation lifecycle will kick in on the old/new values.

### Lifecycle

The activator enforces a lifecycle on all its values. Other than that, it operates like a standard computed observable. Below is an explanation of the lifecycle events you can hook into for advanced screen scenarios. To participate in the lifecycle, implement any (or none) of the functions below on the object that you set the activator to:

* `function canActivate() : bool/promise` - Adding this function allows you to tell the activator whether or not it can be set to this value at the current time. You can return a bool value, for a synchronous response, or a promise that resolves to a bool, for an asynchronous check. 

* `function activate() : undefined/promise` - Adding this function allows the activator to call back into the value when it has been successfully set. You can optionally return a promise to tell the activator when your async activation logic has completed.

* `function canDeactivate(isClose) : bool/promise` - Before the value of the activator is changed to a new value, the current value can reject the switch. To do this, implement this function. Return a bool if the logic is synchronous or a promise for asynchronous checking. The _isClose_ parameter tells you whether or not the activator is merely switching to another object, or trying to permanently release the instance.

* `function deactivate(isClose)` - When the value of the activator is switched to a new value, before the switch occurs, it has the opportunity to clean up after itself. To time into this, implement _deactivate_. The _isClose_ parameter is the same as above.