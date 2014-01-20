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
    <li>
      Use <code>app.showMessage(...)</code> to show a message box.
    </li>
    <li>
      Use <code>app.showModal(...)</code> to show a custom modal.
    </li>
    <li>
      Custom modals consist of a module and a view.
    </li>
    <li>
      Use <code>this.modal.close(...)</code> from within a module to close it.
    </li>
    <li>
      All modals return a promise, resolved by its close.
    </li>
  </ul>
</blockquote>

### Message Boxes

Showing a message box in Durandal is easy. Simply require the _app_ module and call _showMessage_. Here's an example of the most basic usage:

```javascript
var app = require('durandal/app');
...
app.showMessage('This is a message.');
```

This will display a message box with the default title and the message "This is a message." It will also display an "Ok" button.
By default, your message box's title is set to your applications's title (`app.title`). If you haven't set the title, then it defaults to "Application".
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
Notice also that a call to `showMessage` has a return value. This return value is actually a promise for the user's response. 
It will be resolved when they select an option and the message box is closed.

### Custom Modals

It turns out that message boxes are just an implementation of a custom modal dialog.
With Durandal, you can show any UI as a modal, using the same techniques as you aready know. Just create a view and a view model.
Let's see how to do it by looking at how the built-in message box is implemented. 
First, let's see the implementation of _showMessage_ and _showModal_ from the _app_ module:

```javascript
var app = {
  ...
  showModal: function(obj, activationData, context) {
      return modalDialog.show(obj, activationData, context);
  },
  showMessage: function(message, title, options) {
      return modalDialog.show(new MessageBox(message, title, options));
  }
  ...
};
```

It looks like both functions actually call into the _modal dialog_ module. The _showModal_ function is just a direct pass through, but _showMessage_ does a little bit more.
It shows the typical technique for displaying a custom modal. All you have to do is pass an object to _showModal_ and under the covers it will use the composition system to locate its view and bind the two together. Then, it will display it as a modal.
Let's see the implementation of _MessageBox_ and its view.

**messageBox.js**
```javascript
define(function() {
    var MessageBox = function(message, title, options) {
        this.message = message;
        this.title = title || MessageBox.defaultTitle;
        this.options = options || MessageBox.defaultOptions;
    };

    MessageBox.prototype.selectOption = function (dialogResult) {
        this.modal.close(dialogResult);
    };

    MessageBox.defaultTitle = '';
    MessageBox.defaultOptions = ['Ok'];

    return MessageBox;
});
```
**messageBox.html**
```html
<div class="messageBox">
    <div class="modal-header">
        <h3 data-bind="html: title"></h3>
    </div>
    <div class="modal-body">
        <p class="message" data-bind="html: message"></p>
    </div>
    <div class="modal-footer" data-bind="foreach: options">
        <button class="btn" data-bind="click: function () { $parent.selectOption($data); }, html: $data, css: { 'btn-primary': $index() == 0, autofocus: $index() == 0 }"></button>
    </div>
</div>
```

As you can see, _MessageBox_ is just a normal prototype-based class. It stores it's parameters and provides a function to select a particular option.
The view is located by the composition system and bound to it before displaying it in a modal style. The view uses a standard set of Knockout bindings along with some css classes.
There's one important detail to notice. Have a look at the _selectOption_ function of the modal implementation.
It access an attribute of itself called _modal_. When an object is displayed by Durandal's modal system, this special attribute is added. 
It's value is an object with a _close_ function, which, when called, will cause the modal to close.
The interesting thing about it is that you can pass it a value to return to its caller.
When the caller invokes _showModal_ a promise is returned which, as mentioned above, resolves when the modal closes and will carry with it whatever the modal passes to _close_.
Here's how a client might obtain that value:

```javascript
var app = require('durandal/app');
...
app.showMessage('This is a message.').then(function(dialogResult){
  //do something with the dialog result here
});
```

That's all there is to creating a custom modal dialog. It's built like any other UI, by constructing a module and a view. Then, just call `app.showModal` and you are in business.

> **Note:** You can pass more than one value to _close_.