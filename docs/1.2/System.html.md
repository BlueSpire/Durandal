---
title: Docs - System
layout: docs
tags: ['docs','system','reference']
---
# System
#### 

> The _system_ module encapsulates the most basic features used by other modules. 

Below is a list of the APIs it provides:

* `getModuleId(obj) : string` - Returns the module id associated with the specified object.

* `setModuleId(obj, id)` - Sets the module id on the module.

* `debug(enable)` - Call this function to enable or disable Durandal's debug mode. Calling it with no parameters will return true if the framework is currently in debug mode, false otherwise.

* `log(...)` - Logs data to the console. Pass any number of parameters to be logged. Log output is not processed if the framework is not running in debug mode.

* `defer(action) : deferred` - Creates a deferred object which can be used to create a promise. Optionally pass a function action to perform which will be passed an object used in resolving the promise.

* `guid() : string` - Creates a simple V4 UUID. This should not be used as a PK in your database. It can be used to generate internal, unique ids. For a more robust solution see https://github.com/broofa/node-uuid

* `acquire(...) : promise` - Uses require.js to obtain a module. This function returns a promise which resolves with the module instance. You can pass more than one module id to this function. If more than one is passed, then the promise will resolve with one callback parameter per module.