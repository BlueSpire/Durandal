---
title: Docs - Showing Mssage Boxes and Modals
layout: docs
tags: ['docs','modals','how to']
---
# Showing Message Boxes and Modals
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>Configure the dialog module.</li>
    <li>
      Use <code>app.showMessage(...)</code> to show a message box; Aliased from <code>dialog.showMessage(...)</code>
    </li>
    <li>
      Use <code>app.showDialog(...)</code> to show a custom dialog; Aliased from <code>dialog.show(...)</code>
    </li>
    <li>
      Custom dialogs consist of a module and a view.
    </li>
    <li>
      Use <code>dialog.close(this, ...)</code> from within a dialog to close it.
    </li>
    <li>
      All dialogs return a promise, resolved when close is called.
    </li>
  </ul>
</blockquote>

### Message Boxes

Showing a message box in Durandal is easy. Simply configure the plugin, then require the [app module](/documentation/api#module/app) and call _showMessage_. 

Let's first see how to install the plugin. In your _main.js_ file, before calling [app.start()](/documentation/api#module/app/method/start) you will need to make a call to [configurePlugins(...)](/documentation/api#module/app/method/configurePlugins). Here's what your code might look like:

```javascript
define(['durandal/app'],  function (app) {
    app.configurePlugins({
        dialog: true
    });

    app.start().then(function () {
        app.setRoot('shell');
    });
});
```

Once the plugin is installed, you can show a message like this:

```javascript
var app = require('durandal/app');
...
app.showMessage('This is a message.');
```

This will display a message box with the default title and the message "This is a message." It will also display an "Ok" button.
By default, your message box's title is set to your [app.title](/documentation/api#module/app/property/title). If you haven't set the title, then it defaults to "Application".
You can easily add a custom title by providing the second parameter. Here's an example:

```javascript
app.showMessage('This is a message.', 'Demo');
```

This message box is the same as the first, but with "Demo" displayed in the header. Now, suppose you want more than just an "Ok" button. 
The third parameter to this function specifies an array of options to display to the user. Here's what that looks like:

```javascript
var screen = {
  ...
  canDeactivate:function(){
    return app.showMessage('You have unsaved data. Are you sure you want to close?', 'Unsaved Data', ['Yes', 'No']);
  }
  ...
};
```

This message box will have two buttons "Yes" and "No". The yes button, which is first in the list, will be configured as the default action.
Notice also that a call to `showMessage` has a return value. This return value is actually a promise of the user's response. 
It will be resolved when they select an option and the message box is closed.

### Custom Dialogs

It turns out that message boxes are just an implementation of a custom modal dialog.
With Durandal, you can show any UI as a dialog, using the same techniques as you aready know. Just create a view and a view model.
Let's see how to do it by looking at how the built-in message box is implemented. 
First, let's see the implementation of _showMessage_:

```javascript
showMessage:function(message, title, options){
    return dialog.show(new MessageBox(message, title, options));
}
```

This shows the typical technique for displaying a custom dialog. All you have to do is pass an object to [dialog.show](/documentation/api#module/dialog/method/show) and under the covers it will use the composition system to locate its view and bind the two together. Then, it will display it as a dialog.

Let's see part of the implementation of _MessageBox_ and its view.

**messageBox.js**
```javascript
var MessageBox = function(message, title, options) {
    this.message = message;
    this.title = title || MessageBox.defaultTitle;
    this.options = options || MessageBox.defaultOptions;
};

MessageBox.prototype.selectOption = function (dialogResult) {
    dialog.close(this, dialogResult);
};
```
**messageBox.html**
```html
<div class="messageBox">
    <div class="modal-header">
        <h3 data-bind="text: title"></h3>
    </div>
    <div class="modal-body">
        <p class="message" data-bind="text: message"></p>
    </div>
    <div class="modal-footer" data-bind="foreach: options">
        <button class="btn" data-bind="click: function () { $parent.selectOption($data); }, text: $data, css: { 'btn-primary': $index() == 0, autofocus: $index() == 0 }"></button>
    </div>
</div>
```

As you can see, [MessageBox](/documentation/api#module/dialog/class/MessageBox) is just a normal prototype-based class. It stores its parameters and provides a function to select a particular option.
The view is located by the composition system and bound to it before displaying it in a modal style. The view uses a standard set of Knockout bindings along with some css classes.
There's one important detail to notice. Have a look at the [selectOption](/documentation/api#class/MessageBox/method/selectOption) function of the modal implementation.
It uses the [dialog module's](/documentation/api#module/dialog) [close](/documentation/api#module/dialog/method/close) function to dismiss the dialog. The interesting thing about it is that you can pass it a value to return to its caller.
When the caller invokes _show_ a promise is returned which, as mentioned above, resolves when the dialog closes and will carry with it whatever the dialog passes to _close_.
Here's how a client might obtain that value:

```javascript
var app = require('durandal/app');
...
app.showMessage('This is a message.').then(function(dialogResult){
  //do something with the dialog result here
});
```

That's all there is to creating a custom dialog. It's built like any other UI, by constructing a module and a view. Then, just call `app.showDialog` and you are in business.

### Dialog Contexts

All dialogs are shown in a particular visual context. This is a customization point that allows developers to leverage the dialog module's composition and activation infrastructure while controlling the visualization of the dialog.

#### The Default Dialog Context

The default context has the following basic behavior:

1. Displays a blockout over your app. You can change it's opacity by using [getContext](/documentation/api#module/dialog/method/getContext) and changing the context's blockoutOpacity property.
2. Displays your dialog's view centered on the screen.
3. Displays your dialog's view by toggling its opacity from 0 to 1 when ready. This allows for a css 3 transition animation. (Default styles are provided by bootstrap and the durandal.css under source.)
4. When displaying your view, if it's root html element has a class of _autoclose_ then the context will ensure that clicking outside of your dialog automatically causes it to close.
5. When displaying your view, the context will look for any child elements with a class of _autofocus_ and focus them.
6. When removing your view, the same css 3 opacity animation is applied. If you wish to change the timing of this, after you change the animation, you should alter the context's _removeDelay_. This is a delay in milliseconds that waits for the animation to complete before removing the dom nodes from the tree.
7. While the dialog is visible, scroll bars are hidden on the body/html.

>*Note:* The default dialog context has some required css for positioning which can be found in the durandal.css file. It assumes that the target browser supports `position: fixed`. If your target browsers do not support this, you should replace the default dialog context with a custom implementation.

#### Custom Dialog Contexts

You an use the [addContext](/documentation/api#module/dialog/method/addContext) API to add a new dialog context to the system. The context should have the following functions defined:

* [addHost(dialog)](/documentation/api#class/DialogContext/method/addHost) - In this function, you are expected to add a DOM element to the tree which will serve as the "host" for the dialog's composed view. You must add a property called _host_ to the _dialog_ object which references the DOM element. It is this host which is passed to the _composition_ module.

* [removeHost(dialog)](/documentation/api#class/DialogContext/method/removeHost) - This function is expected to remove any DOM machinery associated with the specified _dialog_ and do any other necessary cleanup.

* [compositionComplete(child, parent, context)](/documentation/api#class/DialogContext/method/compositionComplete) - This function is called after the dialog is fully composed into the DOM, allowing your implementation to do any final modifications, such as positioning or animation. You can obtain the original _dialog_ object via `dialog.getDialog(context.model);`.

> **Note:** Whenever you call [addContext](/documentation/api#module/dialog/method/addContext) the _dialog_ module will add a helper method to itself to facillitate showing dialogs in that context. For example, if your create and add a context called 'bubble' for showing bubble popups, you could show these popups in two different ways: `dialog.show(viewModel, activationData, 'bubble')` or `dialog.showBubble(viewModel, activationData)`