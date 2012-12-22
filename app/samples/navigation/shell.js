define(function(require) {
    var first = require('samples/navigation/first'),
        second = require('samples/navigation/second'),
        viewModel = require('durandal/viewModel');

    var shell = {
        displayName:"Navigation",
        activeItem:viewModel.activator()
    };

    //NOTE: Sammy.js is not required by Durandal. This is just an example
    //of how you can use them together for navigation.

    Sammy(function(route) {
        route.get('#/first', function() { shell.activeItem(first); });
        route.get('#/second', function() { shell.activeItem(second); });
        route.get('', function() { shell.activeItem(first); });
    }).run();

    return shell;
});