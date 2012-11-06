define(function(require) {
    var Detail = require('samples/masterDetail/detail'),
        viewModel = require('durandal/viewModel');

    var items = ko.observableArray([
            new Detail("Caliburn.Micro", "Caliburn.Micro is a small, yet powerful framework, designed for building applications across all Xaml Platforms. With strong support for MVVM and other proven UI patterns, Caliburn.Micro will enable you to build your solution quickly, without the need to sacrifice code quality or testability."),
            new Detail("Durandal", "A cross-device, cross-platform application framework written in JavaScript, Durandal is a very small amount of code built on top of three existing and established Javascript libraries: jQuery, Knockout and RequireJS."),
            new Detail("UnityDatabinding", "A general databinding framework for Unity3D. Includes bindings for UI composition and samples for the NGUI library.")
        ]);

    return {
        activeItem: viewModel.activator().for(items),
        items: items
    };
});