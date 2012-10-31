define(function(require) {
    var system = require('durandal/system');

    function createActivator(initialActiveItem) {
        var activeItem = ko.observable(null);

        var computed = ko.computed({
            read: function() {
                return activeItem();
            },
            write: function(newValue) {
                computed.activate(newValue);
            }
        });

        computed.deactivate = function(item, close) {
            return system.defer(function(dfd) {
                if (!item) {
                    dfd.resolve(true);
                    return;
                }

                function doDeactivation() {
                    if (item.deactivate) {
                        system.log("Deactivating", item);

                        var promise = item.deactivate(close);

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

                if (item.canDeactivate) {
                    item.canDeactivate(close).then(function(result) {
                        if (result) {
                            doDeactivation();
                        } else {
                            dfd.resolve(false);
                        }
                    });
                } else {
                    doDeactivation();
                }
            });
        };

        computed.activate = function(item) {
            return system.defer(function(dfd) {
                var currentItem = activeItem();

                computed.deactivate(currentItem, false).then(function(deactivateSucceeded) {
                    if (deactivateSucceeded) {
                        if (!item) {
                            activeItem(item);
                            dfd.resolve(true);
                            return;
                        }

                        function doActivation() {
                            activeItem(item);

                            if (item.activate) {
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

                        if (item.canActivate) {
                            item.canActivate().then(function(result) {
                                if (result) {
                                    doActivation();
                                }
                            });
                        } else {
                            doActivation();
                        }
                    } else {
                        dfd.resolve(false);
                    }
                });
            }).promise();
        };

        if (initialActiveItem) {
            computed.activate(initialActiveItem);
        }

        return computed;
    }

    return {
        activator: createActivator
    };
});