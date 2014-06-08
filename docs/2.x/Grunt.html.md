---
title: Docs - Building and Testing with Grunt
layout: docs
tags: ['docs','testing', 'build']
---
# Building and Testing with Grunt
#### 

> This article describes the setup of the "Durandal HTML Starter Kit Pro" contributed by Rainer Wittmann.

### Quick start

1. Install node from http://nodejs.org
2. Install grunt using `npm install -g grunt-cli`
3. Download/clone the repo found at https://github.com/RainerAtSpirit/HTMLStarterKitPro
4. Run `npm install` in the repo's root directory to install grunt's dependencies
5. Run `grunt`, which will run the default task, which runs `jshint`, `jasmine:modules` and opens the resultant `_specrunner.html` in the browser

### Writing tests
There are two `grunt watch` tasks configured.

1. `grunt watch:modules`. Whenever a spec in the test/specs/modules directory is updated `grunt:watch` will run `grunt:jasmine:modules`.
2. `grunt watch:app`. Durandal app testing, due to its the async nature, isn't that straight forward in jasmine. You can find an example using jasmine's native `runs` and `waitsFor` in `test/specs/app`. Check the [Durandal's](http://www.durandaljs.com) documentation for updated info about that topic.

### Building the app
Experimental: There's a `grunt build` task that builds an optimized version in the build directory.

### Customization

Modify/adjust package.json after cloning. Open `gruntfile.js` to add/modify the existing configuration.

```javascript
    ...
    grunt.registerTask('build', ['jshint', 'jasmine', 'clean', 'copy', 'durandal:main', 'uglify', 'connect:build']);
    grunt.registerTask('default', 'start web server for jasmine tests in browser', function() {
        grunt.task.run('jshint');
        grunt.task.run('jasmine:modules');

        grunt.event.once('connect.test.listening', function( host, port ) {
           var specRunnerUrl = 'http://' + host + ':' + port + '/_SpecRunner.html';
           grunt.log.writeln('Jasmine specs available at: ' + specRunnerUrl);
           require('open')(specRunnerUrl);
        });

        grunt.task.run('connect:test:keepalive');
    });
```

### New to grunt?

Head over to http://gruntjs.com/ to learn the basics.