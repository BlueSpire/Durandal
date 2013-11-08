---
title: Docs - Optimizing on .NET
layout: docs
tags: ['docs','how to','build']
---
# Optimizing on .NET
#### 

Application optimization is ultimately handled by the [RequireJS](http://requirejs.org/) optimizer, _r.js_.
This tool is somewhat complicated to use, so a Durandal-specific optimizer is provided, which generates the proper _r.js_ configuration based on your project.
The optimizer is located at _app/durandal/amd/optimizer.exe_. Here are the basic steps to optimize your app:

1. Be sure that you have installed [NodeJS](http://nodejs.org/). It is required by _r.js_ currently.
2. Navigate to _app/durandal/amd_
3. Run _optimizer.exe_

The optimizer will walk the directory structure up to your _App_ folder, then locate all HTML and JS files recursively underneath it, excluding those in the _amd_ folder.
It will then include all those files in your optimized build, making sure to use the _text_ plugin for HTML files.
The final optimized file will be output directly under your _App_ folder and will be named _main-built.js_.
To deploy, simply remove your RequireJS script reference from your HTML page and replace it with a reference to this self-contained file.

> **Note:** If you are using the Durandal Starter Kit, then the _Index.cshtml_ is already set up to reference the correct script configuration based on your server mode.

#### 

> **Note:** When the Durandal optimizer runs r.js it configures it to replace RequireJS with Almond, a streamlined module loader which assumes an optimized build and is much smaller, since it doesn't need to handle dynamic module downloads.
For more information, read this bit on [using Durandal and Almond together](/documentation/Using-Durandal-with-Almond).