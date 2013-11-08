---
title: Docs - App
layout: docs
tags: ['docs','app','reference']
---
# App
#### 

> The _app module_ controls the application lifecycle and surfaces several services commonly used in building a user experience. 

There are a few things that are related to application startup which are intended to be used in your applications's _main module_.

* `title` - Sets the title for the app. You must set this before calling _start_. This will set the document title and the default message box header. It is also used internally by the router to set the document title when pages change.

* `function start() : promise` - Call this function to bootstrap the Durandal framework. It returns a promise which is resolved when the framework is configured and the dom is ready. At that point you are ready to set your root.

* `function setRoot(root [, transition, applicationHost])` - This sets the root view or view model and displays the composed application in the specified application host. The _root_ parameter is required and can be anything that the _composition module_ understands as a view or view model. This includes strings and objects. If you have a splash screen, you may want to specify an optional _transition_ to animate from the splash to your main shell. The _applicationHost_ parameter is optional. If provided it should be an element id for the node into which the UI should be composed. If it is not provided the default is to look for an element with an id of "applicationHost".

> **Note:** If you intend to run on mobile, you should investigate whether or not to call `app.adaptToDevice()` before setting the root. This function prevents scrolling on the _document_ so that typical iOS/Android "bouncing" browser style scroll after effects do not happen. It is usually used to create more "native" style apps. Doing this does mean you need to write additional css/js to enable scrolling on scrollable divs.

There are several other UI services exposed by the _app module_ which are very useful in typical UI work.

* `function showModal(viewModel) : promise` - A simple helper function that wraps a call to `modalDialog.show()`.

* `function showMessage(message [, title, options]) : promise` - A simple helper function that translates to `return modalDialog.show(new MessageBox(message, title, options));`.

The _app module_ also mixes in functionality from the _events module_ providing a default application-wide eventing mechanism. See the [event module's docs](/documentation/Events) for details of those functions.