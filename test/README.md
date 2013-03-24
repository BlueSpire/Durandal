## Durandal Test Framework
### Running the tests

Run the tests locally using Phantomjs.exe from the commandline:

	phantomjs spec.js

### Writing new tests

The tests are written using [Jasmine](http://pivotal.github.com/jasmine/) running in a [dummy html page](spec.html) using the headless browser [PhantomJS](http://phantomjs.org/). This means the feedback is lightning fast whilst still providing a browser environment for testing DOM interactions.

To create a new test, add a file ending in .spec.js to the specs folder. The test will run in the browser, so we simply use require to pull in the modules under test and any other dependencies necessary:

```javascript
define(['durandal/viewEngine', 'durandal/system'], function (sut, system) {
    describe('.....', function () {
		.....
	});
});	
```

Testing should be limited to the public API of the durandal modules.