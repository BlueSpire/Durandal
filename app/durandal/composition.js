define(function(require) {
    var viewLocator = require('durandal/viewLocator'),
        viewModelBinder = require('durandal/viewModelBinder'),
        viewEngine = require('durandal/viewEngine'),
        system = require('durandal/system');

    var binding = {
        switchContent: function(parent, newChild, settings) {
            if (!newChild) {
                $(parent).empty();
            } else {
                $(parent).empty().append(newChild);

                if (settings.model && settings.model.viewAttached) {
                    settings.model.viewAttached(newChild);
                }
            }
        },
        defaultStrategy: function(settings) {
            return viewLocator.locateViewForObject(settings.model);
        },
        getSettings: function(valueAccessor) {
            var settings = {},
                value = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (typeof value == 'string') {
                settings = value;
            } else if (value && value.__moduleId__) {
                settings = {
                    model: value
                };
            } else {
                for (var attrName in value) {
                    if (typeof attrName == 'string') {
                        var attrValue = ko.utils.unwrapObservable(value[attrName]);
                        settings[attrName] = attrValue;
                    }
                }
            }

            return settings;
        },
        executeStrategy: function(element, settings) {
            var that = this;
            settings.strategy(settings).then(function(view) {
                viewModelBinder.bind(settings.model, view);
                that.switchContent(element, view, settings);
            });
        },
        inject: function(element, settings) {
            var that = this;

            if (!settings.model) {
                this.switchContent(element, null, settings);
                return;
            }

            if (settings.view) {
                viewLocator.locateView(settings.view).then(function(view) {
                    viewModelBinder.bind(settings.model, view);
                    that.switchContent(element, view, settings);
                });
                return;
            }

            if (!settings.strategy) {
                settings.strategy = this.defaultStrategy;
            }

            if (typeof settings.strategy == 'string') {
                system.acquire(settings.strategy).then(function(strategy) {
                    settings.strategy = strategy;
                    that.executeStrategy(element, settings);
                });
            } else {
                this.executeStrategy(element, settings);
            }
        },
        compose: function(element, settings, fallbackModel) {
            var that = this;

            if (typeof settings == 'string') {
                if (settings.indexOf(viewEngine.viewExtension, settings.length - viewEngine.viewExtension.length) !== -1) {
                    settings = {
                        view: settings
                    };
                } else {
                    settings = {
                        model: settings
                    };
                }
            }

            if (settings && settings.__moduleId__) {
                settings = {
                    model:settings
                };
            }

            if (!settings.model) {
                if (!settings.view) {
                    this.switchContent(element, null, settings);
                } else {
                    viewLocator.locateView(settings.view).then(function(view) {
                        viewModelBinder.bind(fallbackModel || {}, view);
                        that.switchContent(element, view, settings);
                    });
                }
            } else if (typeof settings.model == 'string') {
                system.acquire(settings.model).then(function(module) {
                    //TODO: is it an object or function?
                    //if function, call as ctor
                    //should the ctor call happen inside of inject?

                    settings.model = module;
                    that.inject(element, settings);
                });
            } else {
                this.inject(element, settings);
            }
        }
    };

    ko.bindingHandlers.compose = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var settings = binding.getSettings(valueAccessor);
            binding.compose(element, settings, viewModel);
        }
    };

    return binding;
});