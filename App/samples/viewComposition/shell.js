define(function(require) {
    var viewLocator = require('durandal/viewLocator');

    //Normally, you would put this viewLocator configuration in your main.js.
    //It is here only to keep it from cluttering the main.js and confusing the code of other samples.
    viewLocator.convertViewUrlToPartialUrl = function(viewUrl) {
        return 'samples/viewComposition/' + viewUrl;
    };

    return {
        propertyOne: 'This is a databound property from the root context.',
        propertyTwo: 'This property demonstrates that binding contexts flow through composed views.'
    };
});