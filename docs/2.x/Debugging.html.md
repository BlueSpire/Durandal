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
    <li>Configure development cache busting.</li>
  </ul>
</blockquote>

### Explanation

Durandal logs much of its internal activity using it's [system.log](/documentation/api#module/system/method/log) function. It's also a great way for the application developer to add logging. It differs from a straight `console.log` in that it works correctly on every platform and output of this log is sent to the console only if debugging is enabled. You can turn debugging on manually at any time by requiring the [system](/documentation/api#module/system) module and calling [debug(true)](/documentation/api#module/system/method/debug). Likewise, you can disable debugging by passing false.

> **Note:** A common technique is to turn debugging on in your main.js. You can use r.js pragmas to make debug only enable when not optimized for deploy. Here's an example of how that would work: 
 

```JavaScript
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");
```

_The Weyland tooling automatically defines a "build" pragma as part of its default r.js configuration._

### Cache Busting

During application development, make sure your browser is set up to ignore its cache or you may not get your latest JS/HTML changes. In Chrome, you can configure this through the developer tools. Check your preferred browser for a similar option. If no such option is available, then you may want to leverage RequireJS's [urlArgs](http://requirejs.org/docs/api.html#config-urlArgs) configuration option. This appends extra query string arguments to every module or view request and can be useful for cache busting. Here's what your `main.js` configuration might look like:

```javascript
requirejs.config({
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});
```

Be careful not to release a production application like this, as it will completely destroy the caching that is desired in production. For production, you might wish to do something like this:

```javascript
requirejs.config({
    urlArgs: "version=1.2.3",
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});
```