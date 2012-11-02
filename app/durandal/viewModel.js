define(function(require) {
    var system = require('durandal/system');

    function ensureSettings(settings) {
        settings = settings || {};

        if (!settings.closeOnDeactivate) {
            settings.closeOnDeactivate = true;
        }

        if (!settings.beforeActivate) {
            settings.beforeActivate = function(newItem) {
                return newItem;
            };
        }

        if (!settings.afterDeactivate) {
            settings.afterDeactivate = function() { };
        }

        return settings;
    }

    function createActivator(initialActiveItem, settings) {
        var activeItem = ko.observable(null);
        settings = ensureSettings(settings);

        var computed = ko.computed({
            read: function() {
                return activeItem();
            },
            write: function(newValue) {
                computed.activateItem(newValue);
            }
        });

        computed.canDeactivateItem = function(item, close) {
            return system.defer(function(dfd) {
                if (item && item.canDeactivate) {
                    item.canDeactivate(close).then(dfd.resolve);
                } else {
                    dfd.resolve(true);
                }
            }).promise();
        };

        computed.deactivateItem = function(item, close) {
            return system.defer(function(dfd) {
                function doDeactivation() {
                    if (item && item.deactivate) {
                        system.log("Deactivating", item);

                        var promise = item.deactivate(close);

                        if (promise && promise.then) {
                            promise.then(function() {
                                settings.afterDeactivate(item, close);
                                dfd.resolve(true);
                            });
                        } else {
                            settings.afterDeactivate(item, close);
                            dfd.resolve(true);
                        }
                    } else {
                        if (item) {
                            settings.afterDeactivate(item, close);
                        }

                        dfd.resolve(true);
                    }
                }

                computed.canDeactivateItem(item, close).then(function(canDeactivate) {
                    if (canDeactivate) {
                        doDeactivation();
                    } else {
                        dfd.resolve(false);
                    }
                });
            });
        };

        computed.canActivateItem = function(item) {
            return system.defer(function(dfd) {
                if (item && item.canActivate) {
                    item.canActivate().then(dfd.resolve);
                } else {
                    dfd.resolve(true);
                }
            }).promise();
        };

        computed.activateItem = function(item) {
            return system.defer(function(dfd) {
                var currentItem = activeItem();

                computed.deactivateItem(currentItem, settings.closeOnDeactivate).then(function(deactivateSucceeded) {
                    if (deactivateSucceeded) {
                        item = settings.beforeActivate(item);

                        function doActivation() {
                            activeItem(item);

                            if (item && item.activate) {
                                system.log("Activating", item);

                                var promise = item.activate();

                                if (promise && promise.then) {
                                    promise.then(function() {
                                        dfd.resolve(true);
                                    });
                                } else {
                                    dfd.resolve(true);
                                }
                            } else {
                                dfd.resolve(true);
                            }
                        }

                        computed.canActivateItem(item).then(function(canActivate) {
                            if (canActivate) {
                                doActivation();
                            } else {
                                dfd.resolve(false);
                            }
                        });
                    } else {
                        dfd.resolve(false);
                    }
                });
            }).promise();
        };

        computed.canActivate = function() {
            var toCheck;

            if (initialActiveItem) {
                toCheck = initialActiveItem;
                initialActiveItem = false;
            } else {
                toCheck = computed();
            }

            return computed.canActivateItem(toCheck);
        };

        computed.activate = function() {
            var toActivate;

            if (initialActiveItem) {
                toActivate = initialActiveItem;
                initialActiveItem = false;
            } else {
                toActivate = computed();
            }

            return computed.activateItem(toActivate);
        };

        computed.canDeactivate = function(close) {
            return computed.canDeactivateItem(computed(), close);
        };

        computed.deactivate = function(close) {
            return computed.deactivateItem(computed(), close);
        };

        computed.configure = function(configurator) {
            configurator(computed, settings);
            return computed;
        };

        if (settings.parent) {
            settings.parent.canActivate = function() {
                return computed.canActivate();
            };

            settings.parent.activate = function() {
                return computed.activate();
            };

            settings.parent.canDeactivate = function(close) {
                return computed.canDeactivate(close);
            };

            settings.parent.deactivate = function(close) {
                return computed.deactivate(close);
            };
        } else {
            computed.activate();
        }

        return computed;
    }

    return {
        activator: createActivator,
        oneActive: function(items) {
            return function(computed, settings) {
                if (!items && settings.parent && !settings.parent.items) {
                    items = settings.parent.items = ko.observableArray([]);
                }

                settings.closeOnDeactivate = false;

                settings.determineNextItemToActivate = function(list, lastIndex) {
                    var toRemoveAt = lastIndex - 1;

                    if (toRemoveAt == -1 && list.length > 1) {
                        return list[1];
                    }

                    if (toRemoveAt > -1 && toRemoveAt < list.length - 1) {
                        return list[toRemoveAt];
                    }

                    return null;
                };

                settings.beforeActivate = function(newItem) {
                    var activeItem = computed();

                    if (!newItem) {
                        newItem = settings.determineNextItemToActivate(items, activeItem ? items.indexOf(activeItem) : 0);
                    }
                    else {
                        var index = items.indexOf(newItem);

                        if (index == -1) {
                            items.push(newItem);
                        } else {
                            newItem = items[index];
                        }
                    }

                    return newItem;
                };

                settings.afterDeactivate = function(oldItem, close) {
                    if (close) {
                        items.remove(oldItem);
                    }
                };

                var originalCanDeactivate = computed.canDeactivate;
                computed.canDeactivate = function(close) {
                    if (close) {
                        return system.defer(function(dfd) {
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
                                computed.canDeactivateItem(list[i], close).then(function(result) {
                                    results.push(result);
                                    if (results.length == list.length) {
                                        finish();
                                    }
                                });
                            }
                        }).promise();
                    } else {
                        return originalCanDeactivate;
                    }
                };

                var originalDeactivate = computed.deactivate;
                computed.deactivate = function(close) {
                    if (close) {
                        return system.defer(function(dfd) {
                            var list = items();
                            var results = 0;
                            var listLength = list.length;

                            function doDeactivate(item) {
                                computed.deactivateItem(item, close).then(function() {
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
                        return originalDeactivate;
                    }
                };
            };
        }
    };
});