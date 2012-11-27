# Durandal

A cross-device, cross-platform application framework written in JavaScript, Durandal is a very small amount of code built on top of three existing and established Javascript libraries: jQuery, Knockout and RequireJS. 

## Features

* Fully modularize your html and js. ie. Shell.js automatically locates Shell.html, binds and gets composed into the dom. Naturally you can change the conventions…
* Leverage promises everywhere as the API uses no callbacks, but has CommonJS promises plumbed throughout
* Experience the first html/js framework where Composition is embraced at the very core. The view/view-model composition features of Durandal are even more powerful than almost any "native" client framework.
* A simple app model provides you with an app start lifecycle, modal dialogs, message boxes and an event aggregator.
* Build reusable, databindable, skinnable and templatable widgets.
* Leverage optional components for screen and sub-screen activation and de-activation enabling elegant handling of complex screen states.

## Documentation

We're just getting started here, so there's not a ton of documenation yet. But, we are working on it with a vengence. It's all located in the [wiki](https://github.com/EisenbergEffect/Durandal/wiki), so have a look there.

##Samples

To run each sample, open main.js and change the call to app.setRoot() so that it points to the shell of the sample you wish to run.

* hello - Demonstrates a basic hello world application which uses view/view-model location conventions and message box functionality.
* navigation - Demonstrates basic navigation and view/view-model composition via the compose binding.
* masterDetail - Demonstrates some activation features as well as containerless composition.
* widgets - Demonstrates basic bindable and templatable widgets.
* viewComposition - Demonstrates simple deconstruction of views bound against the same binding context.