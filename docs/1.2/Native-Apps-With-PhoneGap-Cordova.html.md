---
title: Docs - Phone and Tablet Apps with PhoneGap
layout: docs
tags: ['docs','native apps','how to']
---
# Phone and Tablet Apps with PhoneGap
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
      Optimize your app.
    </li>
    <li>
      Copy all assets to the _www_ folder of your PhoneGap/Cordova project.
    </li>
    <li>
      Update the _index.html_ file to point to the optimized build (and your other assets).
    </li>
  </ul>
</blockquote>

### Explanation

Creating native applications for phones and tablets is easy by combining Durandal with [PhoneGap/Cordova](http://phonegap.com/).
The first step is to optimize your application for deploy. How you do this depends on what platform and setup you are running.
In general, you have these options:

* If you are using the .NET project, you can run optimizer.exe, located at _app/durandal/amd/optimizer.exe_
* If you are using Mimosa, then you can execute the command `mimosa build -mo`
* For all other configurations, you should see the [r.js documentation](http://requirejs.org/docs/optimization.html) for help using the optimizer directly.

Ultimately, the output of this process should be a file such as _main-built.js_ which contains all your app's JavaScript and HTML.
Next, you will want to locate the _www_ folder inside of your PhoneGap/Cordova project. Copy all your applications's assets to that folder. This includes, images, css, 3rd party JS libraries...and of course, your _main-built.js_ file.
Finally, you need to update the index.html file so that it points to your css, etc and be sure to add a script reference for _main-built.js_. That's it.

> **Note:** If you wish to run without needing to optimize, you may need to perform an additional step.
For example, the PhoneGap Visual Studio 2012 template requires that you alter Plugins/File.cs by changing readResourceAsText, because it reads the views from the wrong location.
You can see [this article](http://mikaelkoskinen.net/durandal-phonegap-windows-phone-8-tutorial/) for more information.