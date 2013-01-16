define(function (require) {
    var viewLocator = require('./viewLocator'),
        viewModelBinder = require('./viewModelBinder'),
        viewEngine = require('./viewEngine'),
        system = require('./system'),
        viewModel = require('./viewModel');

    function shouldPerformActivation(settings) {
        return settings.model && settings.model.activate
            && ((composition.activateDuringComposition && settings.activate == undefined) || settings.activate);
    }

    function tryActivate(settings, successCallback) {
        if (shouldPerformActivation(settings)) {
            viewModel.activator().activateItem(settings.model).then(function (success) {
                if (success) {
                    successCallback();
                }
            });
        } else {
            successCallback();
        }
    }

    function afterContentSwitch(parent, newChild, settings) {
        if (newChild && settings.model && settings.model.viewAttached) {
            settings.model.viewAttached(newChild);
        }

        if (settings.afterCompose) {
            settings.afterCompose(parent, newChild, settings);
        }
    }

    var composition = {
        activateDuringComposition: false,
        convertTransitionToModuleId: function (name) {
            return 'durandal/transitions/' + name;
        },
        switchContent: function (parent, newChild, settings) {
            settings.transition = settings.transition || this.defaultTransitionName;

            if (typeof settings.transition == 'string' && newChild) {
                var transitionModuleId = this.convertTransitionToModuleId(settings.transition);
                system.acquire(transitionModuleId).then(function (transition) {
                    settings.transition = transition;
                    transition(parent, newChild, settings).then(function () {
                        afterContentSwitch(parent, newChild, settings);
                    });
                });
            } else {
                if (!newChild) {
                    ko.virtualElements.emptyNode(parent);
                } else {
                    ko.virtualElements.setDomNodeChildren(parent, [newChild]);
                }

                afterContentSwitch(parent, newChild, settings);
            }
        },
        bindAndShow: function (element, view, settings) {
            tryActivate(settings, function () {
                if (settings.beforeBind) {
                    settings.beforeBind(element, view, settings);
                }

                if (settings.preserveContext && settings.bindingContext) {
                    viewModelBinder.bindContext(settings.bindingContext, view, settings.model);
                } else if (settings.model) {
                    viewModelBinder.bind(settings.model, view);
                } else if (view) {
                    viewModelBinder.bind({}, view);
                }

                composition.switchContent(element, view, settings);
            });
        },
        defaultStrategy: function (settings) {
            return viewLocator.locateViewForObject(settings.model);
        },
        getSettings: function (valueAccessor) {
            var settings = {},
                value = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (typeof value == 'string') {
                return value;
            }

            var moduleId = system.getModuleId(value);
            if (moduleId) {
                return {
                    model: value
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
        executeStrategy: function (element, settings) {
            settings.strategy(settings).then(function (view) {
                composition.bindAndShow(element, view, settings);
            });
        },
        inject: function (element, settings) {
            if (!settings.model) {
                this.bindAndShow(element, null, settings);
                return;
            }

            if (settings.view) {
                viewLocator.locateView(settings.view, settings.area).then(function (view) {
                    composition.bindAndShow(element, view, settings);
                });
                return;
            }

            if (settings.view !== undefined && !settings.view) {
                return;
            }

            if (!settings.strategy) {
                settings.strategy = this.defaultStrategy;
            }

            if (typeof settings.strategy == 'string') {
                system.acquire(settings.strategy).then(function (strategy) {
                    settings.strategy = strategy;
                    composition.executeStrategy(element, settings);
                });
            } else {
                this.executeStrategy(element, settings);
            }
        },
        compose: function (element, settings, bindingContext) {
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

            settings.bindingContext = bindingContext;

            if (!settings.model) {
                if (!settings.view) {
                    this.bindAndShow(element, null, settings);
                } else {
                    settings.area = settings.area || 'partial';
                    settings.preserveContext = true;
                    viewLocator.locateView(settings.view, settings.area).then(function (view) {
                        composition.bindAndShow(element, view, settings);
                    });
                }
            } else if (typeof settings.model == 'string') {
                system.acquire(settings.model).then(function (module) {
                    if (typeof (module) == 'function') {
                        settings.model = new module(element, settings);
                    } else {
                        settings.model = module;
                    }

                    composition.inject(element, settings);
                });
            } else {
                composition.inject(element, settings);
            }
        }
    };

    ko.bindingHandlers.compose = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var settings = composition.getSettings(valueAccessor);
            composition.compose(element, settings, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.compose = true;

    return composition;
});