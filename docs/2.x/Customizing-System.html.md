---
title: Docs - Customizing System
layout: docs
tags: ['docs','system','customization']
---
# Customizing System
#### 

> The [system module]() contains core APIs used by almost every other module. It also has a few strategic extensibility points that can come in handy in different scenarios.

### Module Ids

Durandal assigns a module id to every module that flows through RequireJS. It does this on the basis of its path, relative to the _baseUrl_. If the module is a _function_, the id is assigned to its prototype, otherwise the id is assigned to the object itself. All this behavior can be changed by replacing [system.setModuleId](/documentation/api#module/system/method/setModuleId) and [system.getModuleId](/documentation/api#module/system/method/getModuleId) with your own implementations.

### Module Value Resolution

When Durandal gets tasked with manually requiring your module, such as when the [router](/documentation/api#module/router) attempts to activate a module for a url, then the framework must attempt to resolve an object instance from the module. The default behavior is that if the module is a function, it will be called with _new_ and the result returned, otherwise the module itself will be returned. If you need to change this behavior, you can replace [system.resolveObject](/documentation/api#module/system/method/resolveObject) with your own implementation. [Here's a cool gist](https://gist.github.com/Jaben/6118234) that shows how to patch this API to work with earlier versions of TypeScript (pre 0.9).

### GUIDs

Durandal can generate simple V4 UUIDs with [system.guid()](/documentation/api#module/system/method/guid). However, if you are generating these for use as a database key, you may want to investigate patching this with a more robust solution, such as [node-uuid](https://github.com/broofa/node-uuid).