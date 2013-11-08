---
title: Docs - Testing with PhantomJS and Jasmine
layout: docs
tags: ['docs','testing']
---
# Testing with PhantomJS and Jasmine
#### 

Durandal provides the Durandal Test Framework for unit testing. This test framework uses [PhantomJS](http://phantomjs.org) and [Jasmine](http://pivotal.github.io/jasmine/). As shipped with Durandal, it's focused on testing Durandal's own internal components, but it can easily be adapted for your own unit testing needs.

You can obtain the test framework by downloading the entire Durandal project using git:

```
git clone https://github.com/BlueSpire/Durandal.git
```

> **Note:** If you're not on Windows, you'll also need to install PhantomJS on your system, since the PhantomJS that comes with the Test Framework is an _.exe_.

In your own work, you're probably not going to want to use the entire Durandal project -- you may start with a starter kit such as the [HTML Starter Kit](/version/latest/HTML StarterKit.zip), or even with your own custom setup. For the moment, the Starter Kits don't include the Test Framework, which is why you need to get it from the repository directly.

Once you download the testing framework, you will need to update it's configuration. To do this edit _spec.html_ in the _test_ directory. In that file, you'll see that _require_ is configured with some paths:

```javascript
paths: {
    'specs': '../test/specs/',
    'text': '../lib/require/text',
    'durandal': 'durandal/js',
    'plugins' : 'plugins/js',
    'transitions' : 'transitions/js',
    'knockout': '../lib/knockout/knockout-2.3.0',
    'jquery': '../lib/jquery/jquery-1.9.1'
}
```

For the HTML Starter Kit, with the _test_ directory copied into the top-level directory at the same level as _lib_, _css_, and _app_, you only have to change three of them:

```javascript
'durandal': '../lib/durandal/js',
'plugins' : '../lib/durandal/js/plugins',
'transitions' : '/lib/durandal/js/transitions',
```

In general, you just need to find the _durandal_, _plugins_, and _transitions_ directories and set the paths appropriately. It's also helpful to add a path to the app directory where your code will live:

```javascript
'app': '../app',
```

You can test your paths by removing the existing test modules from _test/specs_ (which will no longer work, since they are for Durandal's internal testing) and replacing them with a new, dummy test module such as:

```javascript
define(['viewmodels/flickr'], function (flickr) {
    describe('', function(){
        it('returns true', function () {
            expect(true).toBe(true);
        });
    });
});
```

This sets up testing for the _flickr_ module that ships with the HTML Starter Kit. If you're using some other setup, you'll need a different test. But this shows how it's done. It doesn't test every path, but since the _flickr_ module uses the _durandal_ and _plugin_ paths, it tells you whether you're on the right track. 

To run the test type the following on the command prompt:

```
$ phantomjs spec.js
```

You'll know that you don't have the paths set correctly if you get an error like the following, which leads to a hang of PhantomJS:

```
Running spec files: specs/mytest.spec
Error: Script error
http://requirejs.org/docs/errors.html#scripterror

  file:///Users/garyrob/Source/Durandal%20Projects/HTML%20StarterKit%20(Durandal%202.0)%20Exp%202/lib/require/require.js:32
  file:///Users/garyrob/Source/Durandal%20Projects/HTML%20StarterKit%20(Durandal%202.0)%20Exp%202/lib/require/require.js:12 in C
  file:///Users/garyrob/Source/Durandal%20Projects/HTML%20StarterKit%20(Durandal%202.0)%20Exp%202/lib/require/require.js:29
 ```

If all is well, you should see something like:

```
Running spec files: specs/mytest.spec
Starting...

Finished
-----------------
1 spec, 0 failures in 0.002s.
```

Now you're ready to unit test your new Durandal project!