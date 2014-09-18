---
title: Docs - Using Yeoman
layout: docs
tags: ['docs', 'build']
---
# Using Yeoman
#### 

> Complete [Yeoman](http://yeoman.io) generator for [Durandal](http://durandaljs.com/) with subgenerators.

### Install Yeoman

This generator needs Yeoman to be installed.

```
$ npm install -g yo
```

### Install Generator

To install generator-durandal from npm, run:

```
$ npm install -g generator-durandal
```

Then, initiate the generator:

```
$ yo durandal
```

Your new application is ready. Start development using a little HTTP server and live reload:

```
$ grunt serve
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


### Development

Some build configurations are already defined using [Grunt](http://gruntjs.com).

#### build

Use build configuration to build your application to production.
This concatenates and minifies your javascript, css and html and reduces your images' size.

```
$ grunt build
```

#### test

Use the test configuration to test your application before building.
This tests your application using [jasmine](http://pivotal.github.io/jasmine/) and [phantomjs](http://phantomjs.org/).

```
$ grunt test
```

#### serve

Use the serve configuration to develop your application and test it in a browser.
This hosts your application in a mini HTTP server with live reloading of your assets.

```
$ grunt serve
```

#### default

Use the default configuration to build and test your application.
This lints, builds and tests your application.

```
$ grunt
```

### Sub Generators

#### ViewModel

You can create a viewmodel using a yeoman subgenerator.
It allows you to create a viewmodel, its view and append it to the router.

```
$ yo durandal:viewmodel
```