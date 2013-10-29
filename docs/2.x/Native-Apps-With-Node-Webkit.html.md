---
title: Docs - Desktop Apps with Node-Webkit
layout: docs
tags: ['docs','native apps','how to']
---
# Desktop Apps with Node-Webkit
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
      Download the correct platform binaries from the [project site](https://github.com/rogerwang/node-webkit).
    </li>
    <li>
      Set up the standard project structure.
    </li>
    <li>
      Patch up require.js and node.
    </li>
  </ul>
</blockquote>

### Explanation

Creating native applications for Windows, Mac And Linux desktop is easy by combining Durandal with [Node-Webkit](https://github.com/rogerwang/node-webkit).
To get started, visit the [Node-Webkit site](https://github.com/rogerwang/node-webkit) and download the binaries for the desired platforms you wish to support.
Next, create a project structure similar to a typical Durandal web app:

* App
  * main.js
  * ...your app files here...
* Content
* Scripts
  * durandal
  * ...other 3rd party libs...
* index.html
* package.json

The package.json file is used by Node-Webkit. Here's a basic example of what that should look like:

```javascript
{
  "name": "My App",
  "description": "Description of my app.",
  "version": "1.0",
  "main": "index.html",
  "window": {
    "toolbar": false,
    "width": 1024,
    "height": 768
  }
}
```

If you want to use the webkit debug tools during development, set `toolbar:true`.
You can find more information on package.json [here](https://github.com/rogerwang/node-webkit/wiki/Manifest-format).


Next, because node has it's own implementation of require that is different from require.js, which Durandal uses, we need to patch things up a bit.
To do that, add the following script block to the head of your index.html:

```javascript
<script type="text/javascript">
  window.gui = require('nw.gui');

  window.requireNode = window.require;
  delete window.require;

  window.requireNode.version = process.versions.node;
  delete process.versions.node;
</script>
```

This script _renames_ Node's require to be `requireNode` and then globally undefines it so that require.js can use `require`.
Before doing that, we grab the Node-Webkit GUI module and store it globally, since it has some dependencies on Node's `require` implementation.
Also, we perform a similar "move" on the `node.version` property. This is to enable _text.js_ to function correctly. The _text_ plugin has special code that runs when in the context of Node. It believes that when Node is present it is part of a build process, rather than running within the application. Removing the version "tricks" _text_ into thinking it's running in browser (it actually is, of course).

> **Note:** We are following up with the `text` plugin authors to try to come up with a better solution in the future.

Finally, you are ready to run your app. To do that you execute `nw path/to/app/folder`.
When you are ready to deploy, check out the Node-Webkit guide on [packaging up your app](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps).
You will probably want to have a look through their [full documentation](https://github.com/rogerwang/node-webkit/wiki).

> **Note:** The folder that `nw` needs is the one containing your package.json file.
For simplicity of development, you can also copy the Node-Webkit files into the same folder and just run `nw`. It will search its folder for a package.json and use that.