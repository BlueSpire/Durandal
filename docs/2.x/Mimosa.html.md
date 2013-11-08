---
title: Docs - Mimosa
layout: docs
tags: ['docs','setup','how to']
---
# Mimosa
#### 

Here's how [Mimosa](http://mimosajs.com/) describes itself:

> A modern browser development toolkit. JavaScript, CSS, and template compilers, linting, optimization, serving, RequireJS support, and Live Reload built right in. Pluggable for authoring your own functionality.

In short, it's an amazing development and build tool for JS applications. If you wish to use it with Durandal, these steps will get your system set up:

1. Install [Node.js](http://nodejs.org/)
2. From the command line execute: `npm install -g mimosa`
3. After this is all set up, creating a new Durandal project is easy-peasy. From the command line execute: `mimosa skel:new durandal path/to/your/new/project/folder`
4. After your project is created, you can run the web app with `make start`
5. You can see the Durandal Starter Kit by opening a browser and navigating to `localhost:3000`
6. You can begin editing the code immediately. You will find it under the _assets_ folder

> **Note:** If you want mimosa to create the project in the *current* folder, simply execute the command without the path portion.

> **Note:** Mimosa has an amazing feature set and extensive documentation. Please visit [their official site](http://mimosajs.com/) to learn more and to troubleshoot Mimosa-specific issues.