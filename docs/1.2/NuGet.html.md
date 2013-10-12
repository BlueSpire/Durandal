---
title: Docs - NuGet
layout: docs
tags: ['docs','nuget','how to','setup']
---
# NuGet
#### 

> To install Durandal into an existing web project, you can use NuGet. Search for "Durandal" in the Library Package Manager or simply open up the Package Manager Console and type the following command `Install-Package Durandal`

### The Durandal Package

When Durandal is installed into your web project it will create one new folder called *App*. This is where you will place your _main.js_ and all the other JavaScript and HTML code for your SPA. There is one subfolder that is added, called _durandal_, and it contains all the AMD modules that make up the Durandal framework. The _amd_ folder contains all the libraries necessary for require.js and app optimization. The optimizer understands the provided folder structure and can optimize your entire SPA (HTML and JavaScript) into a single file. Durandal is dependent on Knockout and jQuery, so those NuGet packages will also be installed into the *Scripts* folder.

#### Additional Packages

In addition to the basic Durandal package, you may also want to install `Durandal.Router` for a quick and easy navigation style app architecture (currently based on SammyJS). If you want to add composition transitions, you can also install `Durandal.Transitions` to get some prefab transitions. 

### The Durandal.StarterKit Package

The `Durandal.StarterKit` package installs all the above packages as well as _Twitter.Bootstrap_, _FontAwesome_ and _Microsoft.AspNet.Web.Optimization_. It also includes some basic views and view models, so you can have a starting place for building your app. If you are starting a new project, we recommend you just install the starter kit nuget.

> **Note:** The Durandal.StarterKit package is designed to be installed into an MVC4 application. It should work with MVC3 as well.