---
title: Docs - Hooking Lifecycle Callbacks
layout: docs
tags: ['docs','lifecycle','how to']
---
# Hooking Lifecycle Callbacks
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>The view locator, view model binder, composition engine and activator all look for callbacks related to their individual functions.</li>
    <li>Composition involves the view locator, the view model binder and it's own DOM manipulation.</li>
    <li>Activator callbacks are not executed unless an [activator](/documentation/View-Model) is present or `activate:true` is set on the compose binding.</li>
  </ul>
</blockquote>

There are various services which play a role in the construction of a screen or of part of a screen. 
Each of these services looks for callbacks on your objects that pertain to its own unique functionality.
Below is a list of the services which may be involved and an explanation of the available callbacks in each context.

### View Locator Callbacks

When the composition engine (or you) calls `viewLocator.locateViewForObject()` it goes through a process of attempting to find the correct view for that object.
Usually, this is accomplished through convention. But, there is a hook which your object can implement to manually return a view.
To do so, add a function called `getView()` to your object. This function can either return a _view id_, used by the infrastructure to lookup the view, 
or it can return a DOMElement, allowing your object to manually construct it's view for absolute control.

### View Model Binder Callbacks

Once a view is obtained, the composition engine will attempt to bind it to the associated object. 
To do this, it uses the view model binder, which looks for two possible hooks on your object. It calls `beforeBind()` just before the databinding happens.
After databinding is complete, it calls `afterBind()`. In both cases it passes the view as an argument.

### Composition Callbacks

After databinding is complete, the composition module then does its part to compose the bound view into the DOM.
It may or may not use a transition as part of this process. Either way, once the view is attached to its parent's DOM node, it will check your object for a `viewAttached()` callback.
This will be called with the view as its argument.

### Activator Callbacks

The hooks described above are checked and run as part of every call to _compose_ whether through the API or the binding handler.
There are another set of hooks cenetered less around the view composition aspects of Durandal and more around screen and component lifecycles.
These hooks are only checked/run when an _activator_ is present. When is an activator present?

1. The Router has an internal activator called "activeItem" which manages the current page.
2. You can create an activator yourself at any time by requiring the view model module and calling it's _activator_ function.
This returns a computed observable that serves as the activator for your objects.
3. When you call `app.setRoot` an activator is used on your root module.
4. If you set `activate:true` on a _compose_ binding, an activator will be used during composition.

> **Note:** Cases 3 and 4 are a bit different as they only enforce _canActivate_ and _activate_ callbacks; not the deactivation lifecycle.
To enable that, you must use a full activator yourself (cases 1 or 2).

#### Activator Lifecycle

* **canDeactivate** - Before a new screen (or component) is activated, the activator checks its current value.
If this value has a `canDeactivate()` hook, then it is called. If this returns false, activation stops.
* **canActivate** - Assuming canDeactivate returned true (or isn't present), the new value will be checked for a `canActivate()` hook.
If present, it will be called. If it returns false, activation stops here.
* **deactivate** - If the previous value can deactivate and the new value can activate, then will call the previous value's `deactivate()` function, if present.
* **activate** - Assuming everything has gone well up to this point: if the new value has an `activate()` function, we call that and the process finishes until a new activation begins.

You can read much more about this in the [view model module's docs](/documentation/View-Model). Remember that all these hooks can return promises and all of them are optional

### Full Lifecycle

Below is a table which shows the order of callbacks and their sources, assuming all necessary components are involved.

<table class="table table-bordered">
  <tr>
    <th>Callback Name</th>
    <th>Durandal Source Module</th>
    <th>Purpose</th>
  </tr>

  <tr class="success">
    <td>`getView()`</td>
    <td>[View Locator](/documentation/View-Locator)</td>
    <td>Enables the new object to return a custom view.</td>
  </tr>

  <tr class="warning">
    <td>`canDeactivate()`</td>
    <td>[View Model](/documentation/View-Model)</td>
    <td>Allows the previous object to cancel deactivation.</td>
  </tr>

  <tr class="warning">
    <td>`canActivate()`</td>
    <td>[View Model](/documentation/View-Model)</td>
    <td>Allows the new object to cancel activation.</td>
  </tr>

  <tr class="warning">
    <td>`deactivate()`</td>
    <td>[View Model](/documentation/View-Model)</td>
    <td>Allows the previous object to execute custom deactivation logic.</td>
  </tr>

  <tr class="warning">
    <td>`activate()`</td>
    <td>[View Model](/documentation/View-Model)</td>
    <td>Allows the new object to execute custom activation logic.</td>
  </tr>

  <tr class="success">
    <td>`beforeBind()`</td>
    <td>[View Model Binder](/documentation/View-Model-Binder)</td>
    <td>Notifies the new object immediately before databinding occurs.</td>
  </tr>

  <tr class="success">
    <td>`afterBind()`</td>
    <td>[View Model Binder](/documentation/View-Model-Binder)</td>
    <td>Notifies the new object immediately after databinding occurs.</td>
  </tr>

  <tr class="success">
    <td>`viewAttached()`</td>
    <td>[Composition](/documentation/Composition)</td>
    <td>Notifies the new object when its view is attached to its parent DOM node.</td>
  </tr>
</table>

> **Remember:** Rows highlighted green will always execute when composing. Those in yellow require the presence of an activator.