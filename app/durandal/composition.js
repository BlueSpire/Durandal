define(function(require) {
    var viewLocator = require('durandal/viewLocator'),
        viewModelBinder = require('durandal/viewModelBinder'),
        viewEngine = require('durandal/viewEngine'),
        system = require('durandal/system');

    var composition = {
        switchContent: function(parent, newChild, settings) {
            if (!newChild) {
                ko.virtualElements.emptyNode(parent);
            } else {
                ko.virtualElements.setDomNodeChildren(parent, [newChild]);

                if (settings.model) {
                    if (settings.activate && settings.model.activate) {
                        system.log("Composition Activating", settings.model);
                        settings.model.activate();
                    }

                    if (settings.model.viewAttached) {
                        settings.model.viewAttached(newChild);
                    }
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
                return value;
            }

            var moduleId = system.getModuleId(value);
            if (moduleId) {
                return {
                    model:value
                };
            }

            for (var attrName in value) {
                if (typeof attrName == 'string') {
                    var attrValue = ko.utils.unwrapObservable(value[attrName]);
                    settings[attrName] = attrValue;
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

            var moduleId = system.getModuleId(settings);
            if (moduleId) {
                settings = {
                    model: settings
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
                    if (typeof (module) == "function") {
                        settings.model = new module();
                    } else {
                        settings.model = module;
                    }

                    that.inject(element, settings);
                });
            } else {
                this.inject(element, settings);
            }
        }
    };

    ko.bindingHandlers.compose = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var settings = composition.getSettings(valueAccessor);
            composition.compose(element, settings, viewModel);
        }
    };

    ko.virtualElements.allowedBindings.compose = true;

    return composition;
});