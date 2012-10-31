define(function(require) {
    var first = require('samples/navigation/first'),
        second = require('samples/navigation/second'),
        viewModel = require('durandal/viewModel');

    return {
        displayName: "Navigation",
        activeItem: viewModel.activator(first),
        gotoFirst: function() {
            this.activeItem(first);
        },
        gotoSecond: function() {
            this.activeItem(second);
        }
    };
});