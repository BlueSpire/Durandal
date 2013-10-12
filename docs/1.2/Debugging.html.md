---
title: Docs - Debugging
layout: docs
tags: ['docs','debugging','how to']
---
# Debugging
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
      View the browser's console window to see Durandal's activity.
    </li>
    <li>
      Use <code>system.log(...)</code> or <code>system.error(...)</code> for application messages.
    </li>
    <li>
      Disable debug mode before releasing to production.
    </li>
  </ul>
</blockquote>

### Explanation

Durandal logs much of it's internal activity using it's `system.log` function. It's also a great way for the application developer to add logging. It differs from a straight `console.log` in that it works correctly on every platform and output of this log is sent to the console only if debugging is enabled. You can turn debugging on manually at any time by requiring the *system* module and calling `debug(true)`. Likewise, you can disable debugging by passing false.

> **Note:** A common technique is to turn debugging on in your main.js. You can use r.js pragmas to make debug only enable when not optimized for deploy. Here's an example of how that would work: 
 

```JavaScript
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");
```

_The .NET optimizer automatically defines a "build" pragma as part of its default r.js configuration._

> **Note:** During application development, make sure your browser is set up to ignore it's cache or you  may not get your latest JS/HTML changes.