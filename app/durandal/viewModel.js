﻿define(function(require) {
    var system = require('./system');

    function ensureSettings(settings) {
        if (settings == undefined) {
            settings = { };
        }

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
        
        if (!settings.interpretGuard) {
            settings.interpretGuard = function (value) {
                if (typeof value == 'string') {
                    return value == 'Yes' || value == 'Ok';
                }

                return value;
            };
        }

        return settings;
    }
    
    function deactivate(item, close, settings, dfd) {
        if (item && item.deactivate) {
            system.log("Deactivating", item);

            var promise = item.deactivate(close);

            if (promise && promise.then) {
                promise.then(function () {
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

    function activate(newItem, activeItem, callback) {
        if (newItem) {
            if (newItem.activate) {
                system.log("Activating", newItem);

                var promise = newItem.activate();

                if (promise && promise.then) {
                    promise.then(function() {
                        activeItem(newItem);
                        callback(true);
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
                var resultOrPromise = item.canDeactivate(close);

                if (resultOrPromise.then) {
                    resultOrPromise.then(function (result) {
                        dfd.resolve(settings.interpretGuard(result));
                    });
                } else {
                    dfd.resolve(settings.interpretGuard(resultOrPromise));
                }
            } else {
                dfd.resolve(true);
            }
        }).promise();
    };
    
    function canActivateItem(newItem, activeItem, settings) {
        return system.defer(function (dfd) {
            if (newItem == activeItem()) {
                dfd.resolve(true);
                return;
            }

            if (newItem && newItem.canActivate) {
                var resultOrPromise = newItem.canActivate();
                if (resultOrPromise.then) {
                    resultOrPromise.then(function (result) {
                        dfd.resolve(settings.interpretGuard(result));
                    });
                } else {
                    dfd.resolve(settings.interpretGuard(resultOrPromise));
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
            read: function() {
                return activeItem();
            },
            write: function (newValue) {
                computed.activateItem(newValue);
            }
        });

        computed.isActivating = ko.observable(false);

        computed.canDeactivateItem = function(item, close) {
            return canDeactivateItem(item, close, settings);
        };

        computed.deactivateItem = function(item, close) {
            return system.defer(function(dfd) {
                computed.canDeactivateItem(item, close).then(function(canDeactivate) {
                    if (canDeactivate) {
                        deactivate(item, close, settings, dfd);
                    } else {
                        computed.notifySubscribers();
                        dfd.resolve(false);
                    }
                });
            });
        };

        computed.canActivateItem = function (newItem) {
            return canActivateItem(newItem, activeItem, settings);
        };

        computed.activateItem = function (newItem) {
            return system.defer(function (dfd) {
                if (computed.isActivating()) {
                    dfd.resolve(false);
                    return;
                }

                computed.isActivating(true);

                var currentItem = activeItem();
                if (currentItem == newItem) {
                    computed.isActivating(false);
                    dfd.resolve(true);
                    return;
                }

                computed.canDeactivateItem(currentItem, settings.closeOnDeactivate).then(function(canDeactivate) {
                    if (canDeactivate) {
                        computed.canActivateItem(newItem).then(function(canActivate) {
                            if (canActivate) {
                                system.defer(function(dfd2) {
                                    deactivate(currentItem, settings.closeOnDeactivate, settings, dfd2);
                                }).promise().then(function() {
                                    newItem = settings.beforeActivate(newItem);
                                    activate(newItem, activeItem, function(result) {
                                        computed.isActivating(false);
                                        dfd.resolve(result);
                                    });
                                });
                            } else {
                                computed.notifySubscribers();
                                computed.isActivating(false);
                                dfd.resolve(false);
                            }
                        });
                    } else {
                        computed.notifySubscribers();
                        computed.isActivating(false);
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

        computed.forItems = function(items) {
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

            return computed;
        };

        return computed;
    }

    return {
        activator: createActivator
    };
});