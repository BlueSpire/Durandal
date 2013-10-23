---
title: Docs - Interacting with the DOM
layout: docs
tags: ['docs','dom','how to']
---
# Interacting with the DOM
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>Use custom Knockout binding handlers to encapsulate view logic.</li>
    <li>Use composition lifecycle callbacks for advanced view manipulation.</li>
    <li>Use widgets to encapsulate re-usable, templatable view patterns along with behavior.</li>
  </ul>
</blockquote>

While standard databinding and composition can go very far in helping you to build your app, eventually you will encounter scenarios where you need to access the DOM.
Below are a few ways you can do this depending on your situation.

### Knockout Binding Handlers

The databinding infrastructure prodived by [Knockout](http://knockoutjs.com/) is very robust. In addition to the built-in bindings, it provides a way to [create custom bindings](http://knockoutjs.com/documentation/custom-bindings.html).
It's a simple way to encapsulate view-related code, keeping your normal modules free from the ugliness of DOM manipulation.
This is the most common mechanism for interacting with the DOM in an application, particularly if the logic is reusable.
For example, it's common to wrap jQuery plugins inside of a custom binding handler so they can be declaratively applied to any element.
It's extremely efficient as well, since the jQuery plugin will gain access to the element it's declared on and won't need to execute any selectors.
Lest you feel that such a mechanism can't be very powerful, it's important to note that Durandal's [composition](/documentation/Using-Composition) and [widget](/documentation/Creating-A-Widget) bindings are just custom KO binding handlers.
For information on building your own binding handlers, see [the Knockout documentation on the subject](http://knockoutjs.com/documentation/custom-bindings.html).

A visit to the KO site or a quick search on github will also help you find many existing community binding handlers which are usable with Durandal.
A useful example of what can be done is <a href="https://github.com/rniemeyer/knockout-delegatedEvents">knockout-delegatedEvents</a> which makes delegated events bindable, without resorting to manual jQuery code.

#### Delayed Binding Handlers

Sometimes your binding handler needs to work with an element only after it is attached to the DOM and when the entire composition of the view is complete. An example of this is any code that needs to measure the size of an HTML element. Durandal provides a way to register a knockout binding handler so that it does not execute until the composition is complete. To do this, use [composition.addBindingHandler](/documentation/api#module/composition/method/addBindingHandler). One common use is in focusing elements. Let's re-write Knockout's `hasFocus` binding so that it is executed after composition is complete. If you have an existing registered binding handler, you can change its execution time simply by doing this:

```javascript
composition.addBindingHandler('hasFocus');
```

If you wanted to write a custom binding handler, then provide it as the second argument:

```javascript
composition.addBindingHandler('myCustomHandler',{
	init:function(){

	},
	update:function(){

	}
});
```

The actual implementation is the same as for Knockout. If you need to return custom binding options from your init, then you can provide a third optional argument, a function which takes the same parameters as init and returns the binding handler options expected by knockout.

### Composition Lifecycle Callbacks

If you are implementing a game or an application component that needs frequent and/or high-performance manipulation of the view, unhindered by databinding, there are several hooks you can use to achieve this.

#### getView and viewUrl

When the composition engine uses the view locator to find the view for an object, one of the first things the view locator does is check to see if the object has a `getView()` function or `viewUrl` property.
The `getView` function allows the object to manually construct a view, wiring any events and doing whatever it desires before handing it back to the locator.
This is the earliest event that can be hooked and provides complete control over the view. Usually, conventional location of HTML files is sufficient, but this hook provides a very powerful alternative. See the [view location docs](/documentation/View-Location) for more information.

#### activate

This callback happens before databinding. It is passed the composition's `activationData` if available. If this function returns a promise, the binding system will wait for it's resolution before completing. You don't have access to the view at this time, but we wanted to list this callback here for completeness.

#### binding & bindingComplete

When the composition engine takes your view and object, and uses the [binder](/documentation/api#module/binder) to bind them together, two other callbacks are executed before and after the binding takes place.
`binding(view)` is called prior to binding and `bindingComplete(view)` is called immeidately after. Each call passes the view to your object. One added capability of the `binding` callback is that it can return an "instruction" object to the binding system. If this object is a `boolean` value of `false`, then Knockout's applyBindings call will not be run. You can also return an object like so `{ applyBindings:false }`.

#### attached

Finally, after the composition engine attaches the bound view to its parent in the DOM, the `attached(view, parent)` callback is called.
This is the most common hook of the three to use. It enables the infrastructure to do as much work as possible and then gives you access to the view when it's attached.
It's a perfect time to add additional behavior, execute selectors, etc.

#### compositionComplete

After the entire view is composed, inlcuding all parent and child compositions that the current component is part of, the `compositionComplete(view, parent)` callbacks will be executed, bubbling from child to parent. You can use this as the latest point of interaction with the view during the composition process. If you need to measure DOM elements, this is the place to do it.

#### detached

When the associated view is detached from the DOM, the `detached(view, parent)` callback will be invoked. This is a great place to do any necessary cleanup work.

### Widgets

Widgets also provide a way to encapsulate DOM interactions. A widget is most approriate when you have a combination of view+behavior that you want to reuse.
In many cases, you may want this re-usable component to be bindable and templatable as well. 
This shouldn't be your first choice when just needing to interact with the DOM. But, it's listed here for completeness.
You can read more about widgets [here](/documentation/Creating-A-Widget).