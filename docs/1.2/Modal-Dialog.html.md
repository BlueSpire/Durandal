---
title: Docs - Modal Dialog
layout: docs
tags: ['docs','modals','reference']
---
# Modal Dialog
#### 

> The _modalDialog_ module supports the common need for modal popovers in applications. 

A default implementation is provided, but this module is designed in such a way that application developers can create their own popover mechanism. It is important to note that under the covers, this module leverages the core functionality of the _composition_ and _viewModel_ modules. The public API is as follows:

* `show(obj [, activationData, context]) : promise` - This API uses the _composition_ module to compose your _obj_ into a modal popover. It also uses the _viewModel_ module to check and enforce any screen lifecycle needs that _obj_ may have. A promise is returned which will be resolved when the modal dialog is dismissed. The _obj_ is the view model for your  modal dialog, or a moduleId for the view model to load. Your view model instance will have a single property added to it by this mechanism called _modal_ which represents the dialog infrastructure itself. This _modal_ object has a single function called _close_ which can be invoked to close the modal. You may also pass any number of arguments to _close_ which will be returned via the promise mechanism. The _modal_ object also references it's owner, activator, the composition settings it was created with and its display context. Speaking of _context_, this parameter represents the display context or modal style. By default, there is one context registered with the system, named 'default'. If no context is specified, the default context with be used to display the modal. You can also specify _activationData_ which is an arbitrary object that will be passed to your modal's _activate_ function, if it has one.

* `isModalOpen() : bool` - This is a helper function which will tell you if any modals are currently open.

* `getNextZIndex() : integer` - This is a helper function which can be used in the creation of custom modal contexts. Each time it is called, it returns a successively higher zIndex value than the last time.

* `getContext([name]) : modalContext` - You may wish to customize modal displays or add additional contexts in order to display modals in different ways. To alter the default context, you would acquire it by calling `getContext()` and then alter it's pipeline. If you don't provide a value for *name* it returns the default context.

* `addContext(name, modalContext)` - Pass a name and an object which defines the proper modal display pipeline via the functions described in the next section. This creates a new modal context or "modal style."

#### The Default Modal Context

The default context has the following basic behavior:

1. Displays a blockout over your app. You can change it's opacity by using _getContext_ and changing the context's blockoutOpacity property.
2. Displays your modal's view centered on the screen.
3. Displays your modal's view by toggling its opacity from 0 to 1 when ready. This allows for a css 3 transition animation. (Default styles are provided by bootstrap and the durandal.css under source.)
4. When displaying your view, if it's root html element has a class of _autoclose_ then the context will ensure that clicking outside of your modal automatically causes it to close.
5. When displaying your view, the context will look for any child elements with a class of _autofocus_ and focus them.
6. When removing your view, the same css 3 opacity animation is applied. If you wish to change the timing of this, after you change the animation, you should alter the context's _removeDelay_. This is a delay in milliseconds that waits for the animation to complete before removing the dom nodes from the tree.
7. While the modal is visible, scroll bars are hidden on the body/html.

>*Note:* The default modal context has some required css for positioning which can be found in the durandal.css file. It assumes that the target browser supports `position: fixed`. If your target browsers do not support this, you should replace the default modal context with a custom implementation.

#### Custom Modal Contexts

You an use the `addContext` API to add a new modal context to the system. The context should have the following functions defined:

* `function addHost(modalWindow)` - In this function, you are expected to add a dom element to the tree which will serve as the "host" for the modal's composed view. You must add a property called _host_ to the _modalWindow_ object which references the dom element. It is this host which is passed to the _composition_ module.

* `function removeHost(modalWindow)` - This function is expected to remove any dom machinery associated with the specified _modalWindow_ and do any other necessary cleanup.

* `function afterCompose(parent, newChild, settings)` - This function is called after the modal is fully composed into the dom, allowing your implementation to do any final modifications, such as positioning or animation. You can obtain the original _modalWindow_ object via _settings.model.modal_.

> **Note:** Whenever you call _addContext_ the _modalDialog_ module will add a helper method to itself to facillitate showing modals in that context. For example, if your create and add a context called 'bubble' for showing bubble popups, you could show these popups in two different ways: `modalDialog.show(viewModel, activationData, 'bubble')` or `modalDialog.showBubble(viewModel, activationData)`