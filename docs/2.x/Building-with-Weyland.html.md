---
title: Docs - Building with Weyland
layout: docs
tags: ['docs']
---
# Building with Weyland
#### 

> When you deploy a Durandal application, you often want to build the source files into a set of packages that are optimized for web deploy. _Weyland_ is Durandal's cross-platform, NodeJS-based build tool, designed for that purpose.

If you started your project with the .NET or Raw HTML starter kit, then you probably already have a default Weyland config file. This config file assumes the default structure provided by that starter kit has been kept. Based on this, it is configured to lint your app code, minify it and then combine the entire app, JS and HTML, into a single output file called `main-built.js`. By default, it also bundles with a custom version of [Almond](https://github.com/BlueSpire/almond), which allows you to remove the RequireJS library. You then reference your _main-built.js_ file directly in your _index.html_ page.

If you do not have an existing config, have a non-standard structure, or need to deploy in multiple packages or with RequireJS instead of Almond, you can do all that by creating your own configuration.

### Installing Weyland

Weylan is a NodeJS-based command line tool. Here are the steps to get it installed:

1. Install [Node.js](http://nodejs.org/)
2. From the command line execute: `npm install -g weyland`

That's it!

### Basic Usage

Once you have Weyland installed, you can use the command line to build an app, by executing the `weyland build` command inside the directory that contains your _weyland-config.js_ file. Assuming you have a standard structure, this will build all the html and js files in your app folder into a single main-built.js file. Prior to doing that it will lint and minify them. It will also combine Durandal into this file and remove the dependency on RequireJS by replacing it with Almond, a minimal module loader for optimized apps.

### Understanding Configuration

...details coming soon...