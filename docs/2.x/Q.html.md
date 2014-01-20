---
title: Docs - Q
layout: docs
tags: ['docs','integration']
---
# Q
#### 

Here's how [Q](https://github.com/kriskowal/q) describes itself:

> A tool for making and composing asynchronous promises in JavaScript.

Internally, Durandal uses jQuery's promise implementation in order to minimize third party dependencies.
However, other libraries you use may require Q or you may need more advanced asynchronous programming capabilities than jQuery can provide.
In these cases, you will want to plug Q's promise mechanism into Durandal so that you can have a single consistent promise implementation throughout.
To integrate the Q library, follow these steps:

1. Add a script tag for the Q library, prior to your require.js script tag (or use path config if you prefer).
2. Add the following code to _main.js_ before your call to `app.start();`

```javascript
system.defer = function (action) {
  var deferred = Q.defer();
  action.call(deferred, deferred);
  var promise = deferred.promise;
  deferred.promise = function() {
      return promise;
  };
  return deferred;
};
```

> **Note:** When working with Breeze or any other library which depends on Q, you should make the above patch.

> **Note:** The above patch will not change promises returned from the [http plugin](/documentation/api#module/http) since that uses jQuery's ajax API directly.
If you are using the [http plugin](/documentation/api#module/http), then you may want to consider patching that manually. Something like this:
```javascript
http.get = function(url, query) {
  return Q.when($.ajax(url, { data: query }));
}
```
Essentially, you need to wrap the jQuery ajax calls with a call to Q.when.