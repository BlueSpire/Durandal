define(function(require) {
    var composition = require('durandal/composition'),
        system = require('durandal/system'),
        dom = require('durandal/dom'),
        viewModel = require('durandal/viewModel');

    var modals = ko.observableArray([]);
    var modalActivator = viewModel.activator().forItems(modals);

    return {
        addHost: function() {

        },
        removeHost: function() {

        },
        createCompositionSettings: function(obj) {
            var moduleId = system.getModuleId(obj);
            if (moduleId) {
                return {
                    model: obj,
                    activate: false
                };
            }

            obj.activate = false;
            return obj;
        },
        show: function(obj) {
            var that = this;
            return system.defer(function(dfd) {
                modalActivator.activateItem(obj).then(function(success) {
                    if (success) {
                        var modalWindow = obj.window = {
                            open: function() {
                                this.host = that.addHost();
                                this.settings = that.createCompositionSettings(obj);
                                composition.compose(this.host, this.settings);
                            },
                            close: function(result) {
                                modalActivator.deactivateItem(obj, true).then(function(closeSuccess) {
                                    if (closeSuccess) {
                                        dfd.resolve(result);
                                        that.removeHost(modalWindow.host);
                                    }
                                });
                            }
                        };

                        modalWindow.open();
                    } else {
                        dfd.resolve(false);
                    }
                });
            }).promise();
        }
    };
});