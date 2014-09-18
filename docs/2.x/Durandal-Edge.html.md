---
title: Docs - Durandal's Edge
layout: docs
tags: ['docs','introduction']
---
# Durandal's Edge

> With so many SPA-style frameworks emerging in the last couple years, you may wonder what makes Durandal unique or different. Why would you want to choose it for your next project?

### A Natural Alliance

Rather than re-invent the wheel, Durandal starts by combining and building on top of three existing libraries. Each of these libraries is very mature, has a large, active community and was strategically chosen because it meets one specific need very well. First we start with jQuery. In some ways you can think of it as a better DOM or the "missing JavaScript core library". Next, we add in RequireJS, which gives us rich, declarative JavaScript modules. Finally, Knockout provides us with powerful two-way data-binding.

With these three libraries as a foundation, Durandal constructs a thin integration layer and transforms them into a powerful SPA framework. In addition to strategically connecting these libraries, Durandal adds new functionality. Some things Durandal adds are:  a client-side router, rich view composition, screen state management, pub/sub, simple conventions, modals/message boxes and more...

### Maximum Skill Reuse

If you’ve worked with any of the three libraries listed above, then you already have skills you can leverage on a Durandal project. You already know part of the framework. This makes it relatively easy for existing web developers to get started. The time you've invested learning the three core libraries on prior traditional web projects translates directly to Durandal apps. Choosing Durandal is almost a "no brainer".

Suppose you've never worked with jQuery, RequireJS or Knockout. Is Durandal worth your time to learn? Why not pick a different SPA framework that is "all inclusive"? The simple answer is YES, it is well worth your time. Here's the longer answer: Almost every major SPA framework has a way to work with the DOM, create modules and declare data bindings. No matter what framework you pick, you are going to have to make the effort to learn these things both conceptually and in terms of the chosen library's API. The difference with Durandal is that we get those capabilities from other libraries which were originally designed for traditional web development. That means that when you learn those things in the context of Durandal, you are also learning things you can directly apply to traditional web development too. It's a huge return on investment.

### Powerful Modularization

All Durandal code is modularized based on the AMD standard, which is supported by our use of RequireJS.  To our knowledge, Durandal is the only SPA framework based on this de-facto standard for JavaScript modularization. As a result, Durandal's capabilities in this department far outshine everything. Because we use the AMD standard, there is no presentation-framework-specific code required to create modules. This not only keeps your own code clean, but also makes it more portable: You can write a Durandal module for use both in a SPA and in a traditional web application where Durandal itself is not even used.

But that’s only the beginning of the advantages...

The AMD spec is pluggable via the notion of loader plugins. These plugins can acquire and transform any resource in any way and supply it as a module dependency. Want to load some JSON data? You can do that declaratively. Want to load CoffeeScript? You can use a loader to compile it on the fly if you want. You can write loaders to do just about anything. Most of Durandal's view engine is in fact supplied by the text loader plugin. What's the really awesome thing about loaders? They can execute code both at runtime and at build time. This means you can have a loader optimize content as part of a build process, but not have to change your application code at all. It's extremely powerful.

Speaking of the build process...RequireJS supplies a build tool called r.js. It essentially takes a list of modules as inputs and spits out 1-n optimized files. For a small or medium-sized application, you might choose to build to one optimized file. For larger apps, you might choose to build a shell with each feature area optimized into its own file...and download features on the fly based on live user usage. That and many more deployment scenarios are what this tool was designed for. On top of that, there are many higher level build tools that work with RequireJS. You can use Grunt, Mimosa or even Durandal's Weyland to automate the process.

Language support for AMD is also great. If you are using CoffeeScript, you’ll quickly notice that it's function and block syntax makes defining modules really clean. But an even better  experience is had when using TypeScript because it has direct language support for the concept of modules. When you compile your TypeScript code you just tell it that you want AMD modules and it will spit out JavaScript ready to work with RequireJS. But that's not the end of it. The work on TypeScript modules, RequireJS and the AMD spec has been influencing the next version of JavaScript directly. RequireJS is already planning to provide a direct migration path for code written with it today to the native module implementation of the JavaScript of the future.

### Beyond Unobtrusive

Because Durandal relies on AMD modules and a lite set of conventions, you actually don't see Durandal itself in your code very much. Yes, you use its APIs to configure the framework and set up your application's router, but beyond that you don't invoke Durandal much at all. You won't be calling into Durandal to create modules, controllers, models or anything else. You don't need to inherit or extend from any special classes or objects. Most code in a Durandal application is vanilla JavaScript and you could take it out and use it without the framework at all. It's particularly powerful when used in combination with the observable module, which allows you to also remove all traces of Knockout from your code as well.

### Flexible Composition

Not only do you need the ability to break down complex applications into small modules, but you need to be able to "compose" these small pieces together again at runtime. The declarative features of the AMD specification enable you to do this with your JavaScript objects in much the same way that you would leverage IoC and even simple name-spacing in other languages. The result is powerful and flexible object composition right out of the box.

But you don't just need to compose objects, you need to compose views. Fortunately, Durandal has the most powerful, declarative view composition engine available in any framework today. Here's a short list of some things you can do declaratively:

* Statically/Dynamically compose a child view into a parent, allowing the binding context of the parent to be applied to the child.
* Statically/Dynamically compose a child view with it's own binding context into a parent view.
* Statically compose a model with a dynamically changing view.
* Statically compose a view with a dynamically changing model.
* Statically/Dynamically compose in a view while overriding parts of the view with custom HTML on a case-by-case basis in the parent. It can have it's own binding context or inherit its parent's.

This is just a few examples of what can be done. Keep in mind that in all these cases the composition can be configured with transition animations, optimized per composition site to cache views or be driven entirely by static or dynamically changing data.

### Elegant Asynchronicity

Building rich clients usually involves asynchronous requests for data or other resources. Durandal was designed to handle this with elegance from the very beginning. To that point, Durandal uses promises throughout. Durandal's own API exposes all potentially asynchronous commands via promises. Internally, Durandal also understands when you use promises and it can therefor cause the binding system, router and other key features to respond appropriately. Out of the box, our promise implementation is provided by jQuery. However, existing site documentation explains how you can switch that out in favor of your favorite promise library, such as Q.

If you are targeting an ES5 browser, you can then enable the observable module. When this module is active, it teaches the binding system to data-bind directly to promises. The result is that you can set up a foreach binding over a promise for an array of data. In your own code, you don't have to handle the promise yourself at all.

### Navigation & Screen State Management

Durandal's router is perhaps the most powerful router available today. It is configured with simple route-to-module mappings but can also be configured for convention-based routing. It automatically handles bad routes, supports hash and push state navigation and provides a lot of capabilities around data driven routes such as parameters, optional parameters, splats and query strings. Additionally, we support the notion of "child routers" allowing you to structure and encapsulate entire areas of your application, reducing the overall complexity of the navigation structure.

In real applications you need more than just routing though. You need something which is occasionally called "screen state management." What is that? Imagine you’ve got a customer filling out a form in your application. Before they save, they attempt to navigate to a new screen. The current screen is in a "dirty" state and the application may want to prevent the user from navigating away...or at least temporarily halt the process and ask the user what it should do with the data. In Durandal, the router supports something we call the "screen activation lifecycle" which allows any screen to synchronously or asynchronously control flow into and out of screens. But this functionality is implemented so that it's decoupled from the router itself, thus Durandal also uses it to handle the lifecycle of its modal dialogs. In fact, you can use it anywhere in your app, even controlling fragments of a screen and individual component activations. This is a complex bit of functionality to get right but it is critical in real applications. Most frameworks just ignore it entirely, but not Durandal.

### Enterprise Ready

#### Consistent Testability

SPA’s can be complex code-bases and such projects need to be tested. Durandal has this area covered well. Because we've built on RequireJS and all of your code is built as AMD modules, you can easily fake, mock, or stub any part of the system. This applies both to your code as well as all of Durandal's modules. The test strategy is consistent.  In fact, if you want to see how to write unit tests for your application, all you have to do is fork the Durandal test suite, change some file paths and you are up and running with a test setup for yourself. If you are interested in testability, there are several articles in the documentation that expand upon this.

#### SEO Optimization

From the beginning of work on Durandal 2.0, SEO was considered. Interestingly, much of this work has to be handled on the server for a SPA. That said, Durandal supports all the necessary client-side hooks and configuration options to enable full Google crawling of your application. Interested in how to make it wll work? We've got some great documentation on that.

#### Globalization and Localization

Modern applications need to be made available to diverse people groups. Today Durandal is being used by companies all over the world who are rolling out apps to multiple cultures. Since Durandal was designed to be pluggable, it actually only takes a few minutes to plug a localization solution into the binder. With just a few lines of code centralized in one part of your code-base, you can ensure that everything displayed on the screen is properly localized; no hassle, no fuss.

#### Responsible Versioning

The Durandal project follows Sematic Versioning with great rigor. APIs do not break on minor or patch releases. Minor releases contain only additions and patches contain only bug fixes. Only major version changes signal potential breakage. Those aren’t going to happen very often. When you depend on Durandal, you know exactly what the version numbers mean and what you can expect when updating. The docs from previous versions are made available perpetually and conversion guides are provided for major version changes. We handle integration of the dependent libraries for you as well.

#### Commercial Support and Training

Durandal has an active community that is happy to help you learn the framework as you work through your application's unique challenges. Much discussion is taking place already in our Google Group as well as on Stack Overflow. However, if that is not enough for you, or if you or your business need a safety net, Durandal has a few options available to you.  First, we have commercial support. This is a monthly subscription you can cancel any time and is priced based on the team size. We usually have clients purchase the commercial support for the few months they are working on the project and then discontinue after a successful rollout. It’s a great bargain compared to traditional consulting prices and turnaround time is very good. Additionally, Blue Spire provides customized training either delivered in person at your place of business or virtually through a series of web meetings. Pricing is usually negotiated on a case by case basis depending on the depth, time length and number of students. Finally, in the next couple of months you are going to start seeing official video training become available. Some of this will be free and some of it will be available for a reasonable price, providing you not only with a way to learn directly from us, but also to financially support the project.

### Conclusion

While there are several SPA frameworks available today, only Durandal has all the benefits and characteristics listed above. But not only is it one of the most powerful and flexible options today, it also provides you with a great return on investment for your non-SPA web work. On top of all that, it’s enterprise ready and the kind of training and support you would expect is readily available. And this is just the beginning. Wait until you see what’s next...