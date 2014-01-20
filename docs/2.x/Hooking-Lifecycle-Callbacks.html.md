---
title: Docs - Hooking Lifecycle Callbacks
layout: docs
tags: ['docs','lifecycle','how to']
---
# Hooking Composition &amp; Activator Callbacks
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>The view locator, binder, composition engine and activator all look for callbacks related to their individual functions.</li>
    <li>Composition involves the view locator, the binder and it's own DOM manipulation.</li>
    <li>Activator callbacks are not executed unless an [activator](/documentation/View-Model) is present.</li>
    <li>Built-in activators include the Router and the Dialog system.</li>
  </ul>
</blockquote>

There are various services which play a role in the construction of a screen or of part of a screen. 
Each of these services looks for callbacks on your objects that pertain to its own unique functionality.
Below is a list of the services which may be involved and an explanation of the available callbacks in each context.

### Composition Lifecycle Callbacks

When the composition engine (or you) calls [viewLocator.locateViewForObject()](/documentation/api#module/viewLocator/method/locateViewForObject) it goes through a process of attempting to find the correct view for that object.
Usually, this is accomplished through convention. But, there is a hook which your object can implement to manually return a view.
To do so, add a function called `getView()` to your object. This function can either return a _view id_, used by the infrastructure to lookup the view, 
or it can return a DOMElement, allowing your object to manually construct it's view for absolute control. Alternatively, you can add a `viewUrl` property.

Next, the composition engine looks for an `activate` callback. If any `activationData` is specified in the compose binding, then that is passed as an argument. If the `activate` callback returns a promise, the composition engine will wait for its resolution before proceding.

Once a view is obtained and activation completes, the composition engine will attempt to bind the view with its associated object. 
To do this, it uses the [binder](/documentation/api#module/binder), which looks for two possible hooks on your object. It calls `binding(view)` just before the databinding happens.
After databinding is complete, it calls `bindingComplete(view)`. In the case of the `binding` callback, you can return `false` or an object of the form `{ applyBindings:false }` to cancel the Knockout `applyBindings` call.

After databinding is complete, the composition module then does its part to compose the bound view into the DOM.
It may or may not use a transition as part of this process. Either way, once the view is attached to its parent's DOM node, it will check your object for a `attached(view, parent)` callback.

Finally, when the entire composition process is complete, including any parent and child compositions, the composition engine will call the `compositionComplete(view, parent)` callback, bubbling from child to parent.

If your view is removed from the DOM, the `detached(view, parent)` callback is invoked.

### Activator Lifecycle Callbacks

The hooks described above are checked and run as part of every call to _compose_ whether through the API or the binding handler.
There is another set of hooks centered less around the view composition aspects of Durandal and more around screen and component lifecycles.
These hooks are only checked/run when an _activator_ is present. When is an activator present?

1. The Router has an internal activator called "activeItem" which manages the current page.
2. The dialog system leverages an internal activator to control dialogs.
3. You can create an activator yourself at any time by requiring the [activator module](/documentation/api#module/activator) and calling it's [create](/documentation/api#module/activator/method/create) function.
This returns a computed observable that serves as the activator for your objects.
4. When you call `app.setRoot` a (limited) activator is used on your root module.

> **Note:** Case 4 is a bit different as it only enforces _canActivate_ and _activate_ callbacks; not the deactivation lifecycle. To enable that, you must use a full activator yourself (cases 1-3).

#### Activator Lifecycle

* **canDeactivate** - Before a new screen (or component) is activated, the activator checks its current value.
If this value has a `canDeactivate()` hook, then it is called. If this returns false, activation stops.
* **canActivate** - Assuming canDeactivate returned true (or isn't present), the new value will be checked for a `canActivate()` hook.
If present, it will be called. If it returns false, activation stops here.
* **deactivate** - If the previous value can deactivate and the new value can activate, then we call the previous value's `deactivate()` function, if present.
* **activate** - Assuming everything has gone well up to this point: if the new value has an `activate()` function, we call that and the process finishes until a new activation begins.

You can read much more about this in the documentation on [using activators](/documentation/Using-Activators). Remember that all these hooks can return promises and all of them are optional

>**Note: ** You may have noticed that both the Composition Lifecycle and the Activator Lifecycle define an `activate` callback. When an _activator_ is present, it takes over control of activation from the composition system, so that `activate` is only called once, and only according to the above rules.

### Combined Lifecycle

Below is a table which shows the order of callbacks and their sources, assuming a composition that also involves an activator.

<table class="table table-bordered">
  <tr>
    <th>Callback</th>
    <th>Lifecycle</th>
    <th>Purpose</th>
  </tr>

  <tr class="success">
    <td class="success">`getView()` and `viewUrl`</td>
    <td>Composition</td>
    <td>Enables the new object to return a custom view.</td>
  </tr>

  <tr>
    <td>`canDeactivate()`</td>
    <td>Activator</td>
    <td>Allows the previous object to cancel deactivation.</td>
  </tr>

  <tr>
    <td>`canActivate()`</td>
    <td>Activator</td>
    <td>Allows the new object to cancel activation.</td>
  </tr>

  <tr>
    <td>`deactivate()`</td>
    <td>Activator</td>
    <td>Allows the previous object to execute custom deactivation logic.</td>
  </tr>

  <tr class="success">
    <td>`activate()`</td>
    <td>Composition &amp; Activator</td>
    <td>Allows the new object to execute custom activation logic.</td>
  </tr>

  <tr class="success">
    <td>`binding()`</td>
    <td>Composition</td>
    <td>Notifies the new object immediately before databinding occurs.</td>
  </tr>

  <tr class="success">
    <td>`bindingComplete()`</td>
    <td>Composition</td>
    <td>Notifies the new object immediately after databinding occurs.</td>
  </tr>

  <tr class="success">
    <td>`attached()`</td>
    <td>Composition</td>
    <td>Notifies the new object when its view is attached to its parent DOM node.</td>
  </tr>

  <tr class="success">
    <td>`compositionComplete()`</td>
    <td>Composition</td>
    <td>Notifies the new object when the composition it participates in is complete.</td>
  </tr>

  <tr class="success">
    <td>`detached()`</td>
    <td>Composition</td>
    <td>Notifies a composed object when its view is removed from the DOM.</td>
  </tr>
</table>

> **Remember:** Rows highlighted green will always execute when composing.