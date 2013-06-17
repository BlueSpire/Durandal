define(['durandal/system', 'durandal/viewLocator', 'durandal/viewModelBinder', 'durandal/viewEngine', 'durandal/activator', 'jquery', 'knockout'], function (system, viewLocator, viewModelBinder, viewEngine, activator, $, ko) {
    var dummyModel = {},
        activeViewAttributeName = 'data-active-view',
        composition,
        documentAttachedCallbacks = [],
        compositionCount = 0;

    function getHostState(parent) {
        var elements = [];
        var state = {
            childElements: elements,
            activeView: null
        };

        var child = ko.virtualElements.firstChild(parent);

        while (child) {
            if (child.nodeType == 1) {
                elements.push(child);
                if (child.getAttribute(activeViewAttributeName)) {
                    state.activeView = child;
                }
            }

            child = ko.virtualElements.nextSibling(child);
        }

        return state;
    }
    
    function endComposition() {
        compositionCount--;

        if (compositionCount === 0) {
            var i = documentAttachedCallbacks.length;

            while(i--) {
                documentAttachedCallbacks[i]();
            }

            documentAttachedCallbacks = [];
        }
    }

    function tryActivate(context, successCallback) {
        if (context.activate && context.model && context.model.activate) {
            var result;

            if(system.isArray(context.activationData)) {
                result = context.model.activate.apply(context.model, context.activationData);
            } else {
                result = context.model.activate(context.activationData);
            }

            if(result && result.then) {
                result.then(successCallback);
            } else if(result || result === undefined) {
                successCallback();
            } else {
                endComposition();
            }
        } else {
            successCallback();
        }
    }

    function triggerViewAttached() {
        var context = this;

        if (context.activeView) {
            context.activeView.removeAttribute(activeViewAttributeName);
        }

        if (context.child) {
            if (context.model && context.model.viewAttached) {
                if (context.composingNewView || context.alwaysAttachView) {
                    context.model.viewAttached(context.child, context);
                }
            }
            
            context.child.setAttribute(activeViewAttributeName, true);

            if (context.composingNewView && context.model) {
                if (context.model.documentAttached) {
                    composition.current.completed(function () {
                        context.model.documentAttached(context.child, context);
                    });
                }

                if (context.model.documentDetached) {
                    composition.documentDetached(context.child, function () {
                        context.model.documentDetached(context.child, context);
                    });
                }
            }
        }
        
        if (context.afterCompose) {
            context.afterCompose(context.child, context);
        }

        if (context.documentAttached) {
            composition.current.completed(function () {
                context.documentAttached(context.child, context);
            });
        }

        endComposition();
        context.triggerViewAttached = system.noop;
    }

    function shouldTransition(context) {
        if (system.isString(context.transition)) {
            if (context.activeView) {
                if (context.activeView == context.child) {
                    return false;
                }

                if (!context.child) {
                    return true;
                }

                if (context.skipTransitionOnSameViewId) {
                    var currentViewId = context.activeView.getAttribute('data-view');
                    var newViewId = context.child.getAttribute('data-view');
                    return currentViewId != newViewId;
                }
            }
            
            return true;
        }
        
        return false;
    }

    composition = {
        convertTransitionToModuleId: function (name) {
            return 'transitions/' + name;
        },
        current: {
            completed: function (callback) {
                documentAttachedCallbacks.push(callback);
            }
        },
        documentDetached: function (element, callback) {
            ko.utils.domNodeDisposal.addDisposeCallback(element, callback);
        },
        switchContent: function (context) {
            context.transition = context.transition || this.defaultTransitionName;

            if (shouldTransition(context)) {
                var transitionModuleId = this.convertTransitionToModuleId(context.transition);
                system.acquire(transitionModuleId).then(function (transition) {
                    context.transition = transition;
                    transition(context).then(function () { context.triggerViewAttached(); });
                });
            } else {
                if (context.child != context.activeView) {
                    if (context.cacheViews && context.activeView) {
                        $(context.activeView).css('display', 'none');
                    }

                    if (!context.child) {
                        if (!context.cacheViews) {
                            ko.virtualElements.emptyNode(context.parent);
                        }
                    } else {
                        if (context.cacheViews) {
                            if (context.composingNewView) {
                                context.viewElements.push(context.child);
                                ko.virtualElements.prepend(context.parent, context.child);
                            } else {
                                $(context.child).css('display', '');
                            }
                        } else {
                            ko.virtualElements.emptyNode(context.parent);
                            ko.virtualElements.prepend(context.parent, context.child);
                        }
                    }
                }

                context.triggerViewAttached();
            }
        },
        bindAndShow: function (child, context) {
            context.child = child;

            if (context.cacheViews) {
                context.composingNewView = (ko.utils.arrayIndexOf(context.viewElements, child) == -1);
            } else {
                context.composingNewView = true;
            }

            tryActivate(context, function () {
                if (context.beforeBind) {
                    context.beforeBind(child, context);
                }

                if (context.preserveContext && context.bindingContext) {
                    if (context.composingNewView) {
                        viewModelBinder.bindContext(context.bindingContext, child, context.model);
                    }
                } else if (child) {
                    var modelToBind = context.model || dummyModel;
                    var currentModel = ko.dataFor(child);

                    if (currentModel != modelToBind) {
                        if (!context.composingNewView) {
                            $(child).remove();
                            viewEngine.createView(child.getAttribute('data-view')).then(function(recreatedView) {
                                composition.bindAndShow(recreatedView, context);
                            });
                            return;
                        }
                        viewModelBinder.bind(modelToBind, child);
                    }
                }

                composition.switchContent(context);
            });
        },
        defaultStrategy: function (context) {
            return viewLocator.locateViewForObject(context.model, context.viewElements);
        },
        getSettings: function (valueAccessor, element) {
            var value = valueAccessor(),
                settings = ko.utils.unwrapObservable(value) || {},
                activatorPresent = activator.isActivator(value),
                moduleId;

            if (system.isString(settings)) {
                return settings;
            }

            moduleId = system.getModuleId(settings);
            if(moduleId) {
                settings = {
                    model: settings
                };
            } else {
                if(!activatorPresent && settings.model) {
                    activatorPresent = activator.isActivator(settings.model);
                }

                for(var attrName in settings) {
                    settings[attrName] = ko.utils.unwrapObservable(settings[attrName]);
                }
            }

            if (activatorPresent) {
                settings.activate = false;
            } else if (settings.activate === undefined) {
                settings.activate = true;
            }

            return settings;
        },
        executeStrategy: function (context) {
            context.strategy(context).then(function (child) {
                composition.bindAndShow(child, context);
            });
        },
        inject: function (context) {
            if (!context.model) {
                this.bindAndShow(null, context);
                return;
            }

            if (context.view) {
                viewLocator.locateView(context.view, context.area, context.viewElements).then(function (child) {
                    composition.bindAndShow(child, context);
                });
                return;
            }

            if (!context.strategy) {
                context.strategy = this.defaultStrategy;
            }

            if (system.isString(context.strategy)) {
                system.acquire(context.strategy).then(function (strategy) {
                    context.strategy = strategy;
                    composition.executeStrategy(context);
                });
            } else {
                this.executeStrategy(context);
            }
        },
        compose: function (element, settings, bindingContext) {
            compositionCount++;

            if (system.isString(settings)) {
                if (viewEngine.isViewUrl(settings)) {
                    settings = {
                        view: settings
                    };
                } else {
                    settings = {
                        model: settings,
                        activate: true
                    };
                }
            }

            var moduleId = system.getModuleId(settings);
            if (moduleId) {
                settings = {
                    model: settings,
                    activate: true
                };
            }

            var hostState = getHostState(element);

            settings.activeView = hostState.activeView;
            settings.parent = element;
            settings.triggerViewAttached = triggerViewAttached;
            settings.bindingContext = bindingContext;

            if (settings.cacheViews && !settings.viewElements) {
                settings.viewElements = hostState.childElements;
            }

            if (!settings.model) {
                if (!settings.view) {
                    this.bindAndShow(null, settings);
                } else {
                    settings.area = settings.area || 'partial';
                    settings.preserveContext = true;

                    viewLocator.locateView(settings.view, settings.area, settings.viewElements).then(function (child) {
                        composition.bindAndShow(child, settings);
                    });
                }
            } else if (system.isString(settings.model)) {
                system.acquire(settings.model).then(function (module) {
                    settings.model = system.resolveObject(module);
                    composition.inject(settings);
                });
            } else {
                composition.inject(settings);
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