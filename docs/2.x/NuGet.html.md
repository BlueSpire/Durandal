---
title: Docs - NuGet
layout: docs
tags: ['docs','nuget','how to','setup']
---
# NuGet
#### 

> To install Durandal into an existing web project, you can use NuGet. Search for "Durandal" in the Library Package Manager or simply open up the Package Manager Console and type the following command `Install-Package Durandal`

### The Durandal Package

When Durandal is installed into your web project it will create two new folders: *App* and *Scripts/durandal*. *App* is where you will place your _main.js_ and all the other JavaScript and HTML code for your SPA. The  _durandal_ folder contains all the AMD modules that make up the core Durandal framework as well as its optional plugins. As part of the package install, several other dependencies will be added, including: jQuery, Knockout and RequireJS. We will also add r.js and almond-custom.js, which can be used during app optimization.

#### Additional Packages

In addition to the basic Durandal package, you may also want to install `Durandal.Transitions` to get the prefab _entrance_ transition. 

### The Durandal.StarterKit Package

The `Durandal.StarterKit` package installs all the above packages as well as _Twitter.Bootstrap_, _FontAwesome_ and _Microsoft.AspNet.Web.Optimization_. It also includes some basic views and view models, so you can have a starting place for building your app. If you are starting a new project, we recommend you just install the starter kit nuget.

> **Note:** The Durandal.StarterKit package is designed to be installed into an MVC4 application. It should work with MVC3 as well.