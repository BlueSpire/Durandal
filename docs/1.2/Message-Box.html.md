---
title: Docs - Message Box
layout: docs
tags: ['docs','message box','reference']
---
# Message Box
#### 

> The _messageBox_ module is a simple implementation of a typical message or confirmation modal. 

This module is a constructor function for an object that has the following signature `function(message [, title, options])`. The _message_ will be displayed in the body of the dialog. You can use _title_ to specify text in the title or header area. By default this has a value of "Application". You can specify a number of response _options_ as well. This is an array of strings which defaults to a value of ['Ok']. When an option is selected by the user, the modal will be closed and the option will be passed to the promise. This module can be leveraged by using _new_ to create an instance and then passing that instance to the _modalDialog_ module's _show_ function. However, a convenient helper method exists on the _app_ module which does this for you. You can change the appearance of the message box through css or through altering _messageBox.html_.

> **Note:** You can customize the default title and options for all message boxes by setting the properties _defaultTitle_  and _defaultOptions_ on the message box constructor itself.