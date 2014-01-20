---
title: Docs - Ceating a View
layout: docs
tags: ['docs','views','how to']
---
# Creating a View
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
      Durandal renders modules with views.
    </li>
    <li>
      Create a view by adding an html file to your application.
    </li>
    <li>
      Views should have one root element.
    </li>
    <li>
      The <a href="/documentation/View-Locator">view locator</a> matches views to your modules.
    </li>
    <li>
      Use knockout bindings to synchronize a view with its module.
    </li>
  </ul>
</blockquote>

### A Simple Example
 
Views are html fragments, which typically contain data-binding expressions. These binding expressions declare how the module and the view are connected and kept in sync. So, when a property changes in the model, the DOM updates. Or, when a user interacts with or inputs information through the DOM, the model updates.

Let's imagine we have a simple customer list module that we want to display.

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

**customerList.html**
```html
<div>
  <h2>Customers</h2>
  <ul data-bind="foreach: customers">
    <li data-bind="html: fullName"></li>
  </ul>
</div>
```

There are a few noteworthy details in this example.

1. [Knockout](http://knockoutjs.com/) is used to declare bindings between the module and the view.
2. The view has exactly **one** root element. Durandal requires this. If comments are found at the root, they will be removed. In the case where more than one root element is found, they will be wrapped in a div.
3. The _customerList.js_ and _customerList.html_ are paired together by convention. For more information on how that works, or how to customize this behavior, see the documentation on the [view locator](/documentation/View-Locator).