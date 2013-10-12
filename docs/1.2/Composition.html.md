---
title: Docs - Composition
layout: docs
tags: ['docs','composition','reference']
---
# Composition
#### 

> The core concept at the heart of Durandal is **Composition**. Development of complex UI is significantly simplified by breaking the UI down into small pieces that can be intelligently composed at runtime with little to no effort on the part of the developer. The _composition module_ encapsulates the functionality related to this key principle.

### Usage

The _composition module_ exposes various methods for invoking and customizing the UI composition engine. The key function that is exposed is _compose_ and its signature is `function compose(element, settings [, bindingContext])`

The _element_ is the dom node to compose the UI into. The _settings_ object contains the various options which control how composition happens and the _bindingContext_ represents the parent binding context which would serve as a fallback binding context if a model is not specified by the _settings_.  Depending on what is specified in the settings, composition can occur in a variety of ways. Following is a list of the expected settings parameters and their use to produce different behaviors.

> **Note:** Use of the composition module directly by an application developer is rare. It is used directly by the infrastructure of Durandal and most commonly exposed to the application developer in a more convenient form. For example the APIs for showing a modal dialog, showing a message box or setting the application root all invoke the composition functionality. Widgets also use composition. The most common way a developer uses this functionality is through the KnockoutJS _compose_ binding handler extension. Examples of this are shown inline below.

#### Settings can be a string. 
If this is the case, it is assumed to be an identifier either for a module or for a view. If the string ends in an extension recognized by the view engine, then the _viewLocator module_ is used by invoking its _locateView_ function, which returns the identified view partial, actualized as a dom fragment. The _viewModelBinder module_ is then used to bind that view to the _bindingContext_ and it is injected into the element specified by the call to _compose_. 

> **Note:** When no model is specified, the view is interpreted to be a partial view. In this case, the infrastructure sets the _area_ to 'partial'. See _Areas_ below for more information.

If it is not recognized by the _viewLocator_, then it is assumed to be a module id. RequireJS is then used to require the module. Once this is done, the _viewLocator_ is used to locate the conventional view for the module, the _viewModelBinder_ is used to bind them, and it is injected into the specified _element_.

> **Note:** If the module that is resolved by RequireJS is a function, rather than an abject, the function will be invoked with the _new_ modifier and will be passed the _element_ and _settings_ objects.

**Binding Examples**

1. `data-bind="compose: 'myView.html'"` - Locates the view, realizes it, binds it to the parent binding context and composes it into the dom node on which the binding is declared.

2. `data-bind="compose: 'shell'"` - Uses RequireJS to get the _shell module_, locates the view, binds it and injects it into the dom node on which the binding is declared.

3. `data-bind="compose: someProperty"` - Evaluates the binding to obtain the result of _someProperty_. If it is a string, follows the rules specified above to complete the composition with the bound view being injected on the dom node that declares this binding.

#### Settings can be an instance of a module/model.
If this is the case, the _viewLocator_ is used to locate the the conventional view for the module, the _viewModelBinder_ is used to bind them, and it is injected into the specified _element_.

**Binding Examples**

1. `data-bind="compose: someProperty"` - Evaluates the binding to obtain the result of _someProperty_ which, if it is an object instance (and not a string), will follow the process above to finalize the composition process with the bound view being injected on the dom node that declares this binding.

#### Settings can have a property named _model_ and/or a property named _view_.
If a _view_ property exists, but no _model_ property, the view will be resolved and bound to the _bindingContext_, then injected into the _element_. If a _model_ property exists, but no _view_ property, the _viewLocator_ will be used to locate the conventional view, they will be bound, then injected into the _element_. If both _model_ and _view_ properties exist, then they will be bound and injected into the _element_. Bear in mind, if the _model_ is a string, it will be assumed to be a module id and will be resolved with RequireJS. Likewise, if the _view_ is a string, it will be resoled with the _viewLocator_ before binding. Note: When a view is specified in this way, the view's file extension is not required.

**Binding Examples**

1. `data-bind="compose: { model:someModelProperty }"` - The value of _someModelProperty_ is used with the _viewLocator_ to obtain a view. They are then bound and the view is injected into the dom node.

2. `data-bind="compose: { view:someViewProperty }"` - The value of _someViewProperty_ is evaluated. If it is a string, the _viewLocator_ is used to locate the view; otherwise it is assumed to be a view. The resultant view is injected into the dom node.

3. `data-bind="compose: { model:someModelProperty, view:someViewProperty }"` - The value of _someModelProperty is resolved. The value of _someViewProperty_ is resolved and a view is constructed as indicated in 2. The two are then bound and injected into the dom node.

4. `data-bind="compose: { model:someModelProperty, view:'myView.html' }"` - The value of _someModelProperty is resolved. The _viewLocator_ is then used to obtain the view indicated by _view_. They are then bound and the view is injected into the dom node.

5. `data-bind="compose: { model:'shell', view:someViewProperty }"` - RequireJS is used to resolve the _shell module_. The value of _someViewProperty_ is resolved and a view is returned as described in 2. The view is then bound to the resolved module and injected into the dom node.

6. `data-bind="compose: { model:'shell', 'myView.html' }"` - RequireJS is used to resolve the _shell module_. The _viewLocator_ is then used to obtain the view indicated by _view_. The view is then bound to the resolved module and injected into the dom node.

#### Settings can have a _strategy_ property.
By default, if no view is specified, the _viewLocator_ is used to locate the conventional view for the specified _model_. However, settings can contain a _strategy_ property which specifies a custom function capable of resolving the view to be used instead. The signature of the function should be `function strategy(settings) : promise` The _settings_ parameter is the same as above, however, at this stage in the pipeline, the _model_ property will always be an object instance. Any strings will already have been resolved to modules. This allows your custom strategy to resolve the view based on the model instance and any other custom properties you may have previously declared on the settings object. The custom strategy function should return a promise which resolves the realized view as a dom fragment ready for binding and insertion into the dom. If the _strategy_ is a string, it is assumed to be a module id and RequireJS will be used to require the custom strategy.

**Binding Examples**

1. `data-bind="compose: { model:$data, strategy:'myCustomViewStrategy' }"` - Uses RequireJS to resolve a module with id of "myCustomViewStrategy". This strategy is then invoked for _$data_ to find the view. The resultant view is then bound to _$data_ and injected into the node in which the binding is declared.

#### Containerless Composition
The composition features presented here all work with Knockout's containerless comment syntax as well, so the following is valid: 

`<!-- ko compose: activeItem--><!--/ko-->`

### Additional Settings

#### Transition

When the composition mechanism switches nodes in and out of the dom, it can use a _transition_. To specify a transition, add the _transition_ value to your compose binding. It should be set to a transition name. To create a custom transition, create a folder inside the durandal folder called _transitions_ and place a module there named according to the transition identifier you wish to specify in your compose binding. The transition module you create is a function module with a signature as follows `function (parent, newChild, settings) : promise` _parent_ is the parent dom node of the content being switched, _newChild_ is the new dom node to add into the parent, and _settings_ are all the resolved composition settings passed from the binding. You should return a promise from your transition that resolves when the transition is complete. You can set a default transition for all compositions by setting the composition module's `defaultTransitionName` property.

> **Note:** Transitions are expected to be located in a _transitions_ folder under the durandal folder as stated above. However, you can easily change this conventional location. To do so override the compose module's [overridable](/documentation/Overridable) `convertTransitionToModuleId` function.

> **Note:** In order to create versatile and reusable transitions, you should only add/remove elements from the dom using Knockout's virtual element helpers and you should be sure to take into account the possibility of view caching.

> **Note:** Transitions will not be run if the previous view and the new view are the exact same instance. However, it is possible that while they are not the same instance, they are actually the same view (same html source). In this case the transition will be run. If you wish to disable transitions in this case, then set the composition setting `skipTransitionOnSameViewId` to _true_.

#### Cache Views
In certain case, you may be able to turn on a special optimization. Set `cacheViews:true` on your compose binding and Durandal will not remove old views from the DOM. Instead, it will match view models with existing views and simply run the transition. This allows the framework to bypass html parsing, apply bindings and DOM insertion when the view already exists. This will only happen if the bound object instance is the same as the existing view, otherwise the view will need to be re-created.

> **Note:** See below for details on how this affects _viewAttached_.

#### Activate

For any binding, you can specify an optional setting called _activate_. When set to true, the composition engine will inspect the bound model for a function called _activate_ and invoke it after the UI is fully composed. If you desire for this behavior to be the default, without having to specify `activate:true` on every binding, then you can set the composition module's _activateDuringComposition_ property to true and the above behavior will be executed any time an _activate_ function is present.

> **Note:** If you are using the _viewModel_ module's _activate_ function to create an activator. You should not enable activation on the binding that the activator is bound to since the activator serves the same purpose.

#### Preserve Context
Whenever a compose happens, an isolated binding context is created around that composed view and view model. So, from inside that view, you cannot reach outside to a different model object. We believe this is really important for encapsulation because we've seen some really bad architectural things happen when you can "accidentally" reference things outside of the scope. As a result, things are encapsulated by default. If you want, you can set `preserveContext:true` on the binding to "connect" the new composition to its parent and enable walking up the tree from inside the child composition, but that is not the default. The exceptions to that are when you compose only a view without a module. This is obvious because it must bind to the parent context or else not bind at all. The other exception is inside a widget's templated parts. These parts can reach the outer scope in which the widget is actually declared, because from a developers point of view, the parts "appear" to actually be in that scope and they often need to access it.

#### Area
You can specify an _area_ to pass along with your model to the view locator. This can be used to help further specify sub-group organization of views. For example, you might have a set of readonly views and a set of editing views for models. Setting (or binding) the area property can help the view locator select different views in different scenarios. By default, whenever a view is composed without a model, the composition framework sets _area_ to "partial".

### Hooks
There are two hooks into the composition pipeline which you can specify as callbacks on the composition settings object. Set _beforeBind_ to be called immediately before the databinding occurs. The signature is `beforeBind(element, view, settings)` Set _afterCompose_ to be called immediately after composition has completed. The signature is `afterCompose(parent, newChild, settings)`. These aren't typically used in markup. They are intended to be used when utilizing the composition module in code. For example, they are used internally by the modalDialog and widget modules.

#### View Attached
Whenever Durandal composes, it also checks your model for a function called _viewAttached_. If it is present, it will call the function and pass the bound view as a parameter. This allows a controller or presenter to have direct access to the dom sub-tree to which it is bound at a point in time after it is injected into its parent.

> **Note:** If you have set `cacheViews:true` then _viewAttached_ will only be called the first time the view is shown, on the initial bind, since technically the view is only attached once. If you wish to override this behavior, then set `alwaysAttachView:true` on your composition binding.