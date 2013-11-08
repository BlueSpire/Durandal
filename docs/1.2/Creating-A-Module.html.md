---
title: Docs - Ceating a Module
layout: docs
tags: ['docs','modules','how to']
---
# Creating a Module
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
      All Durandal app code is written as AMD modules.
    </li>
    <li>
       Durandal's module support is provided by [RequireJS](http://requirejs.org/docs/whyamd.html).
    </li>
    <li>
      Create a module by calling <em>define</em> and import other modules using <em>require</em>.
    </li>
    <li>
      Modules can be either objects or functions.
    </li>
    <li>
      All modules have an id.
    </li>
  </ul>
</blockquote>

### A Simple Example

To create a module, start by creating a new _.js_ file. In this file, call _define_ and pass it a function which will be used to build up your module. The return value of the function is what will be imported by other modules when they call _require_.
Here's a simple example of two modules, one of which depends on the other:

**backend.js**
```javascript
define(function(require){
  return {
    getCustomers:function(){
      //do some ajax and return a promise
    }
  };
});
```

**customerList.js**
```javascript
define(function(require){
  var backend = require('backend');

  return {
    customers:ko.observableArray([]),
    activate:function(){
      var that = this;
      return backend.getCustomers().then(function(results){
        that.customers(results);
      });
    }
  };
});
```

As you can see here, both modules declare themselves by calling _define_. 
The _customerList_ module also indicates that it has a dependency on _backend_ by calling _require_ and passing it the path to that module.
The value assigned to the _backend_ variable is the same object instance that was returned from the _backend_ module.

> **Note:** Module paths can be relative to the module which is calling require, or they can be absolute, based on the _baseUrl_ of your app. Unless otherwise configured, the _baseUrl_ is wherever your _main.js_ resides.

### Module Values

In the above example, both modules returned an object instance. This results in what would commonly be called a "singleton" object, since the same object instance is obtained by all who require it.
You are not limited to this pattern, however. Another common module usage pattern is to return a constructor function from the module. This sets up an organization which is common to many other languages where you have one "class" per file.
This allows dependent modules to create instances on demand. Here's a modified version of the above sample which demonstrates that:

**backend.js**
```javascript
define(function(require){
  var backend = function(username, password){
    this.username = username;
    this.password = password;
  };

  backend.prototype.getCustomers = function(){
    //do some ajax and return a promise
  };

  return backend;
});
```

**customerList.js**
```javascript
define(function(require){
  var Backend = require('backend');

  return {
    customers:ko.observableArray([]),
    activate:function(){
      var that = this;
      var service = new Backend('username', 'password');

      return service.getCustomers().then(function(results){
        that.customers(results);
      });
    }
  };
});
```
As you can see _customerList_ depends on _backend_ and uses the _new_ modifier to create instances of it.

### Module Ids

Every module in your application has an Id. This Id is derived from its path, relative to your application's _baseUrl_. 
Unless otherwise configured, your _baseUrl_ is the same as the location of your _main.js_ file.
As part of the module definition process, Durandal assigns every module its Id. This is stored in the semi-private field called \_\_moduleId\_\_.
Should you need to inspect the Id of a module, it is better to use the [system module's](/documentation/system) `getModuleId(object)` function than to access the this field.