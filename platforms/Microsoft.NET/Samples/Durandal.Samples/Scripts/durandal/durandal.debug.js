define('durandal/activator', ['durandal/system'],
function (system) {

    var activator;

    function ensureSettings(settings) {
        if (settings == undefined) {
            settings = {};
        }

        if (!settings.closeOnDeactivate) {
            settings.closeOnDeactivate = activator.defaults.closeOnDeactivate;
        }

        if (!settings.beforeActivate) {
            settings.beforeActivate = activator.defaults.beforeActivate;
        }

        if (!settings.afterDeactivate) {
            settings.afterDeactivate = activator.defaults.afterDeactivate;
        }

        if (!settings.interpretResponse) {
            settings.interpretResponse = activator.defaults.interpretResponse;
        }

        if (!settings.areSameItem) {
            settings.areSameItem = activator.defaults.areSameItem;
        }

        return settings;
    }

    function invoke(target, method, data) {
        if (system.isArray(data)) {
            return target[method].apply(target, data);
        }

        return target[method](data);
    }

    function deactivate(item, close, settings, dfd, setter) {
        if (item && item.deactivate) {
            system.log('Deactivating', item);

            var result;
            try {
                result = item.deactivate(close);
            } catch(error) {
                system.error(error);
                dfd.resolve(false);
                return;
            }

            if (result && result.then) {
                result.then(function() {
                    settings.afterDeactivate(item, close, setter);
                    dfd.resolve(true);
                }, function(reason) {
                    system.log(reason);
                    dfd.resolve(false);
                });
            } else {
                settings.afterDeactivate(item, close, setter);
                dfd.resolve(true);
            }
        } else {
            if (item) {
                settings.afterDeactivate(item, close, setter);
            }

            dfd.resolve(true);
        }
    }

    function activate(newItem, activeItem, callback, activationData) {
        if (newItem) {
            if (newItem.activate) {
                system.log('Activating', newItem);

                var result;
                try {
                    result = invoke(newItem, 'activate', activationData);
                } catch (error) {
                    system.error(error);
                    callback(false);
                    return;
                }

                if (result && result.then) {
                    result.then(function() {
                        activeItem(newItem);
                        callback(true);
                    }, function(reason) {
                        system.log(reason);
                        callback(false);
                    });
                } else {
                    activeItem(newItem);
                    callback(true);
                }
            } else {
                activeItem(newItem);
                callback(true);
            }
        } else {
            callback(true);
        }
    }

    function canDeactivateItem(item, close, settings) {
        return system.defer(function (dfd) {
            if (item && item.canDeactivate) {
                var resultOrPromise;
                try {
                    resultOrPromise = item.canDeactivate(close);
                } catch(error) {
                    system.error(error);
                    dfd.resolve(false);
                    return;
                }

                if (resultOrPromise.then) {
                    resultOrPromise.then(function(result) {
                        dfd.resolve(settings.interpretResponse(result));
                    }, function(reason) {
                        system.log(reason);
                        dfd.resolve(false);
                    });
                } else {
                    dfd.resolve(settings.interpretResponse(resultOrPromise));
                }
            } else {
                dfd.resolve(true);
            }
        }).promise();
    };

    function canActivateItem(newItem, activeItem, settings, activationData) {
        return system.defer(function (dfd) {
            if (newItem == activeItem()) {
                dfd.resolve(true);
                return;
            }

            if (newItem && newItem.canActivate) {
                var resultOrPromise;
                try {
                    resultOrPromise = invoke(newItem, 'canActivate', activationData);
                } catch (error) {
                    system.error(error);
                    dfd.resolve(false);
                    return;
                }

                if (resultOrPromise.then) {
                    resultOrPromise.then(function(result) {
                        dfd.resolve(settings.interpretResponse(result));
                    }, function(reason) {
                        system.log(reason);
                        dfd.resolve(false);
                    });
                } else {
                    dfd.resolve(settings.interpretResponse(resultOrPromise));
                }
            } else {
                dfd.resolve(true);
            }
        }).promise();
    };

    function createActivator(initialActiveItem, settings) {
        var activeItem = ko.observable(null);

        settings = ensureSettings(settings);

        var computed = ko.computed({
            read: function () {
                return activeItem();
            },
            write: function (newValue) {
                computed.viaSetter = true;
                computed.activateItem(newValue);
            }
        });

        computed.__activator__ = true;
        computed.settings = settings;
        settings.activator = computed;

        computed.isActivating = ko.observable(false);

        computed.canDeactivateItem = function (item, close) {
            return canDeactivateItem(item, close, settings);
        };

        computed.deactivateItem = function (item, close) {
            return system.defer(function(dfd) {
                computed.canDeactivateItem(item, close).then(function(canDeactivate) {
                    if (canDeactivate) {
                        deactivate(item, close, settings, dfd, activeItem);
                    } else {
                        computed.notifySubscribers();
                        dfd.resolve(false);
                    }
                });
            }).promise();
        };

        computed.canActivateItem = function (newItem, activationData) {
            return canActivateItem(newItem, activeItem, settings, activationData);
        };

        computed.activateItem = function (newItem, activationData) {
            var viaSetter = computed.viaSetter;
            computed.viaSetter = false;

            return system.defer(function (dfd) {
                if (computed.isActivating()) {
                    dfd.resolve(false);
                    return;
                }

                computed.isActivating(true);

                var currentItem = activeItem();
                if (settings.areSameItem(currentItem, newItem, activationData)) {
                    computed.isActivating(false);
                    dfd.resolve(true);
                    return;
                }

                computed.canDeactivateItem(currentItem, settings.closeOnDeactivate).then(function (canDeactivate) {
                    if (canDeactivate) {
                        computed.canActivateItem(newItem, activationData).then(function (canActivate) {
                            if (canActivate) {
                                system.defer(function (dfd2) {
                                    deactivate(currentItem, settings.closeOnDeactivate, settings, dfd2);
                                }).promise().then(function () {
                                    newItem = settings.beforeActivate(newItem, activationData);
                                    activate(newItem, activeItem, function (result) {
                                        computed.isActivating(false);
                                        dfd.resolve(result);
                                    }, activationData);
                                });
                            } else {
                                if (viaSetter) {
                                    computed.notifySubscribers();
                                }

                                computed.isActivating(false);
                                dfd.resolve(false);
                            }
                        });
                    } else {
                        if (viaSetter) {
                            computed.notifySubscribers();
                        }

                        computed.isActivating(false);
                        dfd.resolve(false);
                    }
                });
            }).promise();
        };

        computed.canActivate = function () {
            var toCheck;

            if (initialActiveItem) {
                toCheck = initialActiveItem;
                initialActiveItem = false;
            } else {
                toCheck = computed();
            }

            return computed.canActivateItem(toCheck);
        };

        computed.activate = function () {
            var toActivate;

            if (initialActiveItem) {
                toActivate = initialActiveItem;
                initialActiveItem = false;
            } else {
                toActivate = computed();
            }

            return computed.activateItem(toActivate);
        };

        computed.canDeactivate = function (close) {
            return computed.canDeactivateItem(computed(), close);
        };

        computed.deactivate = function (close) {
            return computed.deactivateItem(computed(), close);
        };

        computed.includeIn = function (includeIn) {
            includeIn.canActivate = function () {
                return computed.canActivate();
            };

            includeIn.activate = function () {
                return computed.activate();
            };

            includeIn.canDeactivate = function (close) {
                return computed.canDeactivate(close);
            };

            includeIn.deactivate = function (close) {
                return computed.deactivate(close);
            };
        };

        if (settings.includeIn) {
            computed.includeIn(settings.includeIn);
        } else if (initialActiveItem) {
            computed.activate();
        }

        computed.forItems = function (items) {
            settings.closeOnDeactivate = false;

            settings.determineNextItemToActivate = function (list, lastIndex) {
                var toRemoveAt = lastIndex - 1;

                if (toRemoveAt == -1 && list.length > 1) {
                    return list[1];
                }

                if (toRemoveAt > -1 && toRemoveAt < list.length - 1) {
                    return list[toRemoveAt];
                }

                return null;
            };

            settings.beforeActivate = function (newItem) {
                var currentItem = computed();

                if (!newItem) {
                    newItem = settings.determineNextItemToActivate(items, currentItem ? items.indexOf(currentItem) : 0);
                } else {
                    var index = items.indexOf(newItem);

                    if (index == -1) {
                        items.push(newItem);
                    } else {
                        newItem = items()[index];
                    }
                }

                return newItem;
            };

            settings.afterDeactivate = function (oldItem, close) {
                if (close) {
                    items.remove(oldItem);
                }
            };

            var originalCanDeactivate = computed.canDeactivate;
            computed.canDeactivate = function (close) {
                if (close) {
                    return system.defer(function (dfd) {
                        var list = items();
                        var results = [];

                        function finish() {
                            for (var j = 0; j < results.length; j++) {
                                if (!results[j]) {
                                    dfd.resolve(false);
                                    return;
                                }
                            }

                            dfd.resolve(true);
                        }

                        for (var i = 0; i < list.length; i++) {
                            computed.canDeactivateItem(list[i], close).then(function (result) {
                                results.push(result);
                                if (results.length == list.length) {
                                    finish();
                                }
                            });
                        }
                    }).promise();
                } else {
                    return originalCanDeactivate();
                }
            };

            var originalDeactivate = computed.deactivate;
            computed.deactivate = function (close) {
                if (close) {
                    return system.defer(function (dfd) {
                        var list = items();
                        var results = 0;
                        var listLength = list.length;

                        function doDeactivate(item) {
                            computed.deactivateItem(item, close).then(function () {
                                results++;
                                items.remove(item);
                                if (results == listLength) {
                                    dfd.resolve();
                                }
                            });
                        }

                        for (var i = 0; i < listLength; i++) {
                            doDeactivate(list[i]);
                        }
                    }).promise();
                } else {
                    return originalDeactivate();
                }
            };

            return computed;
        };

        return computed;
    }

    return activator = {
        defaults: {
            closeOnDeactivate: true,
            interpretResponse: function (value) {
                if (typeof value == 'string') {
                    var lowered = value.toLowerCase();
                    return lowered == 'yes' || lowered == 'ok';
                }

                return value;
            },
            areSameItem: function (currentItem, newItem, activationData) {
                return currentItem == newItem;
            },
            beforeActivate: function (newItem) {
                return newItem;
            },
            afterDeactivate: function (item, close, setter) {
                if (close && setter) {
                    setter(null);
                }
            }
        },
        create: createActivator
    };
});
define('durandal/app', ['durandal/system', 'durandal/viewEngine', 'durandal/composition', 'durandal/widget', 'durandal/modalDialog', 'durandal/events'],
function(system, viewEngine, composition, widget, modalDialog, Events) {

    var app = {
        title: 'Application',
        showModal: function(obj, activationData, context) {
            return modalDialog.show(obj, activationData, context);
        },
        showMessage: function(message, title, options) {
            return modalDialog.show('./messageBox', {
                message: message,
                title: title || this.title,
                options: options
            });
        },
        start: function() {
            var that = this;
            if (that.title) {
                document.title = that.title;
            }

            return system.defer(function (dfd) {
                $(function() {
                    system.log('Starting Application');
                    dfd.resolve();
                    system.log('Started Application');
                });
            }).promise();
        },
        setRoot: function(root, transition, applicationHost) {
            var hostElement, settings = { activate: true, transition: transition };

            if (!applicationHost || system.isString(applicationHost)) {
                hostElement = document.getElementById(applicationHost || 'applicationHost');
            } else {
                hostElement = applicationHost;
            }

            if (system.isString(root)) {
                if (viewEngine.isViewUrl(root)) {
                    settings.view = root;
                } else {
                    settings.model = root;
                }
            } else {
                settings.model = root;
            }

            composition.compose(hostElement, settings);
        },
        adaptToDevice: function() {
            document.ontouchmove = function (event) {
                event.preventDefault();
            };
        }
    };

    Events.includeIn(app);

    return app;
});
define('durandal/composition', ['durandal/viewLocator', 'durandal/viewModelBinder', 'durandal/viewEngine', 'durandal/system'],
function (viewLocator, viewModelBinder, viewEngine, system) {

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
            for (var i = 0; i < documentAttachedCallbacks.length; i++) {
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
                isActivator = value && value.__activator__,
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
                if(!isActivator && settings.model) {
                    isActivator = settings.model.__activator__;
                }

                for(var attrName in settings) {
                    settings[attrName] = ko.utils.unwrapObservable(settings[attrName]);
                }
            }

            if (isActivator) {
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
                    settings.model = new (system.getObjectResolver(module))();
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
//heavily borrowed from backbone events, augmented by signals.js, added a little of my own code
//cleaned up for better readability and a more fluent api
define('durandal/events', ['durandal/system'],
function (system) {

    var eventSplitter = /\s+/;
    var Events = function() { };

    var Subscription = function(owner, events) {
        this.owner = owner;
        this.events = events;
    };
    
    Subscription.prototype.then = function (callback, context) {
        this.callback = callback || this.callback;
        this.context = context || this.context;
        
        if (!this.callback) {
            return this;
        }

        this.owner.on(this.events, this.callback, this.context);
        return this;
    };
    
    Subscription.prototype.on = Subscription.prototype.then;
    
    Subscription.prototype.off = function () {
        this.owner.off(this.events, this.callback, this.context);
        return this;
    };
    
    Events.prototype.on = function(events, callback, context) {
        var calls, event, list;

        if (!callback) {
            return new Subscription(this, events);
        } else {
            calls = this.callbacks || (this.callbacks = {});
            events = events.split(eventSplitter);

            while (event = events.shift()) {
                list = calls[event] || (calls[event] = []);
                list.push(callback, context);
            }

            return this;
        }
    };

    Events.prototype.off = function(events, callback, context) {
        var event, calls, list, i;

        // No events
        if (!(calls = this.callbacks)) {
            return this;
        }

        //removing all
        if (!(events || callback || context)) {
            delete this.callbacks;
            return this;
        }

        events = events ? events.split(eventSplitter) : system.keys(calls);

        // Loop through the callback list, splicing where appropriate.
        while (event = events.shift()) {
            if (!(list = calls[event]) || !(callback || context)) {
                delete calls[event];
                continue;
            }

            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }

        return this;
    };

    Events.prototype.trigger = function(events) {
        var event, calls, list, i, length, args, all, rest;
        if (!(calls = this.callbacks)) {
            return this;
        }

        rest = [];
        events = events.split(eventSplitter);
        for (i = 1, length = arguments.length; i < length; i++) {
            rest[i - 1] = arguments[i];
        }

        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {
            // Copy callback lists to prevent modification.
            if (all = calls.all) {
                all = all.slice();
            }

            if (list = calls[event]) {
                list = list.slice();
            }

            // Execute event callbacks.
            if (list) {
                for (i = 0, length = list.length; i < length; i += 2) {
                    list[i].apply(list[i + 1] || this, rest);
                }
            }

            // Execute "all" callbacks.
            if (all) {
                args = [event].concat(rest);
                for (i = 0, length = all.length; i < length; i += 2) {
                    all[i].apply(all[i + 1] || this, args);
                }
            }
        }

        return this;
    };

    Events.prototype.proxy = function(events) {
        var that = this;
        return (function(arg) {
            that.trigger(events, arg);
        });
    };

    Events.includeIn = function(targetObject) {
        targetObject.on = Events.prototype.on;
        targetObject.off = Events.prototype.off;
        targetObject.trigger = Events.prototype.trigger;
        targetObject.proxy = Events.prototype.proxy;
    };

    return Events;
});
define('durandal/messageBox', ['durandal/viewEngine'],
function(viewEngine) {

    var MessageBox = function(message, title, options) {
        this.message = message;
        this.title = title || MessageBox.defaultTitle;
        this.options = options || MessageBox.defaultOptions;
    };

    MessageBox.prototype.selectOption = function (dialogResult) {
        this.modal.close(dialogResult);
    };

    MessageBox.prototype.getView = function(){
        return viewEngine.processMarkup(MessageBox.defaultViewMarkup);
    };

    MessageBox.prototype.activate = function(config) {
        if (config) {
            this.message = config.message;
            this.title = config.title || MessageBox.defaultTitle;
            this.options = config.options || MessageBox.defaultOptions;
        }
    };

    MessageBox.defaultTitle = 'Application';
    MessageBox.defaultOptions = ['Ok'];
    MessageBox.defaultViewMarkup = [
        '<div class="messageBox">',
            '<div class="modal-header">',
                '<h3 data-bind="text: title"></h3>',
            '</div>',
            '<div class="modal-body">',
            '   <p class="message" data-bind="text: message"></p>',
            '</div>',
            '<div class="modal-footer" data-bind="foreach: options">',
                '<button class="btn" data-bind="click: function () { $parent.selectOption($data); }, text: $data, css: { \'btn-primary\': $index() == 0, autofocus: $index() == 0 }"></button>',
            '</div>',
        '</div>'
    ].join('\n');

    return MessageBox;
});
define('durandal/modalDialog', ['durandal/composition', 'durandal/system', 'durandal/activator'],
function (composition, system, activator) {

    var contexts = {},
        modalCount = 0;

    function ensureModalInstance(objOrModuleId) {
        return system.defer(function(dfd) {
            if (system.isString(objOrModuleId)) {
                system.acquire(objOrModuleId).then(function (module) {
                    dfd.resolve(new (system.getObjectResolver(module))());
                });
            } else {
                dfd.resolve(objOrModuleId);
            }
        }).promise();
    }

    var modalDialog = {
        currentZIndex: 1050,
        getNextZIndex: function () {
            return ++this.currentZIndex;
        },
        isModalOpen: function() {
            return modalCount > 0;
        },
        getContext: function(name) {
            return contexts[name || 'default'];
        },
        addContext: function(name, modalContext) {
            modalContext.name = name;
            contexts[name] = modalContext;

            var helperName = 'show' + name.substr(0, 1).toUpperCase() + name.substr(1);
            this[helperName] = function (obj, activationData) {
                return this.show(obj, activationData, name);
            };
        },
        createCompositionSettings: function(obj, modalContext) {
            var settings = {
                model:obj,
                activate:false
            };

            if (modalContext.documentAttached) {
                settings.documentAttached = modalContext.documentAttached;
            }

            return settings;
        },
        show: function(obj, activationData, context) {
            var that = this;
            var modalContext = contexts[context || 'default'];

            return system.defer(function(dfd) {
                ensureModalInstance(obj).then(function(instance) {
                    var modalActivator = activator.create();

                    modalActivator.activateItem(instance, activationData).then(function (success) {
                        if (success) {
                            var modal = instance.modal = {
                                owner: instance,
                                context: modalContext,
                                activator: modalActivator,
                                close: function () {
                                    var args = arguments;
                                    modalActivator.deactivateItem(instance, true).then(function (closeSuccess) {
                                        if (closeSuccess) {
                                            modalCount--;
                                            modalContext.removeHost(modal);
                                            delete instance.modal;
                                            dfd.resolve.apply(dfd, args);
                                        }
                                    });
                                }
                            };

                            modal.settings = that.createCompositionSettings(instance, modalContext);
                            modalContext.addHost(modal);

                            modalCount++;
                            composition.compose(modal.host, modal.settings);
                        } else {
                            dfd.resolve(false);
                        }
                    });
                });
            }).promise();
        }
    };

    modalDialog.addContext('default', {
        blockoutOpacity: .2,
        removeDelay: 200,
        addHost: function(modal) {
            var body = $('body');
            var blockout = $('<div class="modalBlockout"></div>')
                .css({ 'z-index': modalDialog.getNextZIndex(), 'opacity': this.blockoutOpacity })
                .appendTo(body);

            var host = $('<div class="modalHost"></div>')
                .css({ 'z-index': modalDialog.getNextZIndex() })
                .appendTo(body);

            modal.host = host.get(0);
            modal.blockout = blockout.get(0);

            if (!modalDialog.isModalOpen()) {
                modal.oldBodyMarginRight = $("body").css("margin-right");
                
                var html = $("html");
                var oldBodyOuterWidth = body.outerWidth(true);
                var oldScrollTop = html.scrollTop();
                $("html").css("overflow-y", "hidden");
                var newBodyOuterWidth = $("body").outerWidth(true);
                body.css("margin-right", (newBodyOuterWidth - oldBodyOuterWidth + parseInt(modal.oldBodyMarginRight)) + "px");
                html.scrollTop(oldScrollTop); // necessary for Firefox
            }
        },
        removeHost: function(modal) {
            $(modal.host).css('opacity', 0);
            $(modal.blockout).css('opacity', 0);

            setTimeout(function() {
                $(modal.host).remove();
                $(modal.blockout).remove();
            }, this.removeDelay);
            
            if (!modalDialog.isModalOpen()) {
                var html = $("html");
                var oldScrollTop = html.scrollTop(); // necessary for Firefox.
                html.css("overflow-y", "").scrollTop(oldScrollTop);
                $("body").css("margin-right", modal.oldBodyMarginRight);
            }
        },
        documentAttached: function (child, context) {
            var $child = $(child);
            var width = $child.width();
            var height = $child.height();

            $child.css({
                'margin-top': (-height / 2).toString() + 'px',
                'margin-left': (-width / 2).toString() + 'px'
            });

            $(context.model.modal.host).css('opacity', 1);

            if ($(child).hasClass('autoclose')) {
                $(context.model.modal.blockout).click(function() {
                    context.model.modal.close();
                });
            }

            $('.autofocus', child).each(function() {
                $(this).focus();
            });
        }
    });

    return modalDialog;
});
define('durandal/system', ['require'],
function(require) {

    var isDebugging = false,
        nativeKeys = Object.keys,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        system,
        treatAsIE8 = false,
        nativeIsArray = Array.isArray,
        slice = Array.prototype.slice;

    //see http://patik.com/blog/complete-cross-browser-console-log/
    // Tell IE9 to use its built-in console
    if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == 'object') {
        try {
            ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd']
                .forEach(function(method) {
                    console[method] = this.call(console[method], console);
                }, Function.prototype.bind);
        } catch (ex) {
            treatAsIE8 = true;
        }
    }

    // callback for dojo's loader 
    // note: if you wish to use Durandal with dojo's AMD loader,
    // currently you must fork the dojo source with the following
    // dojo/dojo.js, line 1187, the last line of the finishExec() function: 
    //  (add) signal("moduleLoaded", [module.result, module.mid]);
    // an enhancement request has been submitted to dojo to make this
    // a permanent change. To view the status of this request, visit:
    // http://bugs.dojotoolkit.org/ticket/16727

    if (require.on) {
        require.on("moduleLoaded", function(module, mid) {
            system.setModuleId(module, mid);
        });
    }

    // callback for require.js loader
    if (typeof requirejs !== 'undefined') {
        requirejs.onResourceLoad = function(context, map, depArray) {
            system.setModuleId(context.defined[map.id], map.id);
        };
    }

    var noop = function() { };

    var log = function() {
        try {
            // Modern browsers
            if (typeof console != 'undefined' && typeof console.log == 'function') {
                // Opera 11
                if (window.opera) {
                    var i = 0;
                    while (i < arguments.length) {
                        console.log('Item ' + (i + 1) + ': ' + arguments[i]);
                        i++;
                    }
                }
                // All other modern browsers
                else if ((slice.call(arguments)).length == 1 && typeof slice.call(arguments)[0] == 'string') {
                    console.log((slice.call(arguments)).toString());
                } else {
                    console.log(slice.call(arguments));
                }
            }
            // IE8
            else if ((!Function.prototype.bind || treatAsIE8) && typeof console != 'undefined' && typeof console.log == 'object') {
                Function.prototype.call.call(console.log, console, slice.call(arguments));
            }

            // IE7 and lower, and other old browsers
        } catch (ignore) { }
    };

    var logError = function(error) {
        throw error;
    };

    system = {
        version: "2.0.0",
        noop: noop,
        getModuleId: function(obj) {
            if (!obj) {
                return null;
            }

            if (typeof obj == 'function') {
                return obj.prototype.__moduleId__;
            }

            if (typeof obj == 'string') {
                return null;
            }

            return obj.__moduleId__;
        },
        setModuleId: function(obj, id) {
            if (!obj) {
                return;
            }

            if (typeof obj == 'function') {
                obj.prototype.__moduleId__ = id;
                return;
            }

            if (typeof obj == 'string') {
                return;
            }

            obj.__moduleId__ = id;
        },
        getObjectResolver: function(module) {
            if (system.isFunction(module)) {
                return module;
            } else {
                return (function() { return module; });
            }
        },
        debug: function(enable) {
            if (arguments.length == 1) {
                isDebugging = enable;
                if (isDebugging) {
                    this.log = log;
                    this.error = logError;
                    this.log('Debug mode enabled.');
                } else {
                    this.log('Debug mode disabled.');
                    this.log = noop;
                    this.error = noop;
                }
            } else {
                return isDebugging;
            }
        },
        log: noop,
        error: noop,
        assert: function (condition, message) {
            if (!condition) {
                system.error(new Error(message || 'Assertion failed.'));
            }
        },
        defer: function(action) {
            return $.Deferred(action);
        },
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        acquire: function() {
            var modules = slice.call(arguments, 0);
            return this.defer(function(dfd) {
                require(modules, function() {
                    var args = arguments;
                    setTimeout(function() {
                        dfd.resolve.apply(dfd, args);
                    }, 1);
                });
            }).promise();
        },
        extend: function(obj) {
            var rest = slice.call(arguments, 1);

            for (var i = 0; i < rest.length; i++) {
                var source = rest[i];

                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            }

            return obj;
        }
    };

    system.keys = nativeKeys || function(obj) {
        if (obj !== Object(obj)) {
            throw new TypeError('Invalid object');
        }

        var keys = [];

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                keys[keys.length] = key;
            }
        }

        return keys;
    };

    system.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
    };

    system.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) == '[object Array]';
    };

    system.isObject = function(obj) {
        return obj === Object(obj);
    };

    system.isBoolean = function(obj) {
        return typeof(obj) === "boolean";
    };

    //isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    var isChecks = ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'];

    function makeIsFunction(name) {
        var value = '[object ' + name + ']';
        system['is' + name] = function(obj) {
            return toString.call(obj) == value;
        };
    }

    for (var i = 0; i < isChecks.length; i++) {
        makeIsFunction(isChecks[i]);
    }

    return system;
});
define('durandal/viewEngine', ['durandal/system'],
function (system) {

    var parseMarkup;

    if ($.parseHTML) {
        parseMarkup = function (html) {
            return $.parseHTML(html);
        };
    } else {
        parseMarkup = function (html) {
            return $(html).get();
        };
    }

    return {
        viewExtension: '.html',
        viewPlugin: 'text',
        isViewUrl: function (url) {
            return url.indexOf(this.viewExtension, url.length - this.viewExtension.length) !== -1;
        },
        convertViewUrlToViewId: function (url) {
            return url.substring(0, url.length - this.viewExtension.length);
        },
        convertViewIdToRequirePath: function (viewId) {
            return this.viewPlugin + '!' + viewId + this.viewExtension;
        },
        parseMarkup: parseMarkup,
        processMarkup: function (markup) {
            var allElements = this.parseMarkup(markup);
            if (allElements.length == 1) {
                return allElements[0];
            }

            var withoutCommentsOrEmptyText = [];

            for (var i = 0; i < allElements.length; i++) {
                var current = allElements[i];
                if (current.nodeType != 8) {
                    if (current.nodeType == 3) {
                        var result = /\S/.test(current.nodeValue);
                        if (!result) {
                            continue;
                        }
                    }

                    withoutCommentsOrEmptyText.push(current);
                }
            }

            if (withoutCommentsOrEmptyText.length > 1) {
                return $(withoutCommentsOrEmptyText).wrapAll('<div class="durandal-wrapper"></div>').parent().get(0);
            }

            return withoutCommentsOrEmptyText[0];
        },
        createView: function(viewId) {
            var that = this;
            var requirePath = this.convertViewIdToRequirePath(viewId);

            return system.defer(function(dfd) {
                system.acquire(requirePath).then(function(markup) {
                    var element = that.processMarkup(markup);
                    element.setAttribute('data-view', viewId);
                    dfd.resolve(element);
                });
            }).promise();
        }
    };
});
define('durandal/viewLocator', ['durandal/system', 'durandal/viewEngine'],
function (system, viewEngine) {

    function findInElements(nodes, url) {
        for (var i = 0; i < nodes.length; i++) {
            var current = nodes[i];
            var existingUrl = current.getAttribute('data-view');
            if (existingUrl == url) {
                return current;
            }
        }
    }
    
    function escape(str) {
        return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
    }

    return {
        useConvention: function(modulesPath, viewsPath, areasPath) {
            modulesPath = modulesPath || 'viewmodels';
            viewsPath = viewsPath || 'views';
            areasPath = areasPath || viewsPath;

            var reg = new RegExp(escape(modulesPath), 'gi');

            this.convertModuleIdToViewId = function (moduleId) {
                return moduleId.replace(reg, viewsPath);
            };

            this.translateViewIdToArea = function (viewId, area) {
                if (!area || area == 'partial') {
                    return areasPath + '/' + viewId;
                }
                
                return areasPath + '/' + area + '/' + viewId;
            };
        },
        locateViewForObject: function(obj, elementsToSearch) {
            var view;

            if (obj.getView) {
                view = obj.getView();
                if (view) {
                    return this.locateView(view, null, elementsToSearch);
                }
            }

            if (obj.viewUrl) {
                return this.locateView(obj.viewUrl, null, elementsToSearch);
            }

            var id = system.getModuleId(obj);
            if (id) {
                return this.locateView(this.convertModuleIdToViewId(id), null, elementsToSearch);
            }

            return this.locateView(this.determineFallbackViewId(obj), null, elementsToSearch);
        },
        convertModuleIdToViewId: function(moduleId) {
            return moduleId;
        },
        determineFallbackViewId: function (obj) {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((obj).constructor.toString());
            var typeName = (results && results.length > 1) ? results[1] : "";

            return 'views/' + typeName;
        },
        translateViewIdToArea: function (viewId, area) {
            return viewId;
        },
        locateView: function(viewOrUrlOrId, area, elementsToSearch) {
            if (typeof viewOrUrlOrId === 'string') {
                var viewId;

                if (viewEngine.isViewUrl(viewOrUrlOrId)) {
                    viewId = viewEngine.convertViewUrlToViewId(viewOrUrlOrId);
                } else {
                    viewId = viewOrUrlOrId;
                }

                if (area) {
                    viewId = this.translateViewIdToArea(viewId, area);
                }

                if (elementsToSearch) {
                    var existing = findInElements(elementsToSearch, viewId);
                    if (existing) {
                        return system.defer(function(dfd) {
                            dfd.resolve(existing);
                        }).promise();
                    }
                }

                return viewEngine.createView(viewId);
            }

            return system.defer(function(dfd) {
                dfd.resolve(viewOrUrlOrId);
            }).promise();
        }
    };
});
define('durandal/viewModelBinder', ['durandal/system'],
function (system) {

    var viewModelBinder;
    var insufficientInfoMessage = 'Insufficient Information to Bind';
    var unexpectedViewMessage = 'Unexpected View Type';

    function doBind(obj, view, action) {
        if (!view || !obj) {
            if (viewModelBinder.throwOnErrors) {
                system.error(new Error(insufficientInfoMessage));
            } else {
                system.log(insufficientInfoMessage, view, obj);
            }
            return;
        }

        if (!view.getAttribute) {
            if (viewModelBinder.throwOnErrors) {
                system.error(new Error(unexpectedViewMessage));
            } else {
                system.log(unexpectedViewMessage, view, obj);
            }
            return;
        }

        var viewName = view.getAttribute('data-view');
        
        try {
            viewModelBinder.beforeBind(obj, view);
            action(viewName);
            viewModelBinder.afterBind(obj, view);
        } catch (e) {
            if (viewModelBinder.throwOnErrors) {
                system.error(new Error(e.message + ';\nView: ' + viewName + ";\nModuleId: " + system.getModuleId(obj)));
            } else {
                system.log(e.message, viewName, obj);
            }
        }
    }

    return viewModelBinder = {
        beforeBind: system.noop,
        afterBind: system.noop,
        throwOnErrors: false,
        bindContext: function(bindingContext, view, obj) {
            if (obj) {
                bindingContext = bindingContext.createChildContext(obj);
            }

            doBind(bindingContext, view, function (viewName) {
                if (obj && obj.beforeBind) {
                    obj.beforeBind(view);
                }

                system.log('Binding', viewName, obj || bindingContext);
                ko.applyBindings(bindingContext, view);
                
                if (obj && obj.afterBind) {
                    obj.afterBind(view);
                }
            });
        },
        bind: function(obj, view) {
            doBind(obj, view, function (viewName) {
                if (obj.beforeBind) {
                    obj.beforeBind(view);
                }
                
                system.log('Binding', viewName, obj);
                ko.applyBindings(obj, view);
                
                if (obj.afterBind) {
                    obj.afterBind(view);
                }
            });
        }
    };
});
define('durandal/widget', ['durandal/system', 'durandal/composition'],
function(system, composition) {

    var partAttributeName = 'data-part',
        partAttributeSelector = '[' + partAttributeName + ']';

    var kindModuleMaps = {},
        kindViewMaps = {},
        bindableSettings = ['model', 'view', 'kind'];

    var widget = {
        getParts: function(elements) {
            var parts = {};

            if (!system.isArray(elements)) {
                elements = [elements];
            }

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];

                if (element.getAttribute) {
                    var id = element.getAttribute(partAttributeName);
                    if (id) {
                        parts[id] = element;
                    }

                    var childParts = $(partAttributeSelector, element)
                                        .not($('[data-bind^="widget:"] ' + partAttributeSelector, element));

                    for (var j = 0; j < childParts.length; j++) {
                        var part = childParts.get(j);
                        parts[part.getAttribute(partAttributeName)] = part;
                    }
                }
            }

            return parts;
        },
        getSettings: function(valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (system.isString(value)) {
                return value;
            } else {
                for (var attrName in value) {
                    if (ko.utils.arrayIndexOf(bindableSettings, attrName) != -1) {
                        value[attrName] = ko.utils.unwrapObservable(value[attrName]);
                    } else {
                        value[attrName] = value[attrName];
                    }
                }
            }

            return value;
        },
        registerKind: function(kind) {
            ko.bindingHandlers[kind] = {
                init: function() {
                    return { controlsDescendantBindings: true };
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var settings = widget.getSettings(valueAccessor);
                    settings.kind = kind;
                    widget.create(element, settings, bindingContext);
                }
            };

            ko.virtualElements.allowedBindings[kind] = true;
        },
        mapKind: function(kind, viewId, moduleId) {
            if (viewId) {
                kindViewMaps[kind] = viewId;
            }

            if (moduleId) {
                kindModuleMaps[kind] = moduleId;
            }
        },
        mapKindToModuleId: function(kind) {
            return kindModuleMaps[kind] || widget.convertKindToModulePath(kind);
        },
        convertKindToModulePath: function(kind) {
            return 'widgets/' + kind + '/viewmodel';
        },
        mapKindToViewId: function(kind) {
            return kindViewMaps[kind] || widget.convertKindToViewPath(kind);
        },
        convertKindToViewPath: function(kind) {
            return 'widgets/' + kind + '/view';
        },
        beforeBind: function (child, context) {
            var replacementParts = widget.getParts(context.parent);
            var standardParts = widget.getParts(child);

            for (var partId in replacementParts) {
                $(standardParts[partId]).replaceWith(replacementParts[partId]);
            }
        },
        createCompositionSettings: function(element, settings) {
            if (!settings.model) {
                settings.model = this.mapKindToModuleId(settings.kind);
            }

            if (!settings.view) {
                settings.view = this.mapKindToViewId(settings.kind);
            }

            settings.preserveContext = true;
            settings.beforeBind = this.beforeBind;
            settings.activate = true;
            settings.activationData = settings;

            return settings;
        },
        create: function(element, settings, bindingContext) {
            if (system.isString(settings)) {
                settings = { kind: settings };
            }

            var compositionSettings = widget.createCompositionSettings(element, settings);

            composition.compose(element, compositionSettings, bindingContext);
        }
    };

    ko.bindingHandlers.widget = {
        init: function() {
            return { controlsDescendantBindings: true };
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var settings = widget.getSettings(valueAccessor);
            widget.create(element, settings, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.widget = true;

    return widget;
});
