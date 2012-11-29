define(function(require) {
    var composition = require('durandal/composition'),
        system = require('durandal/system'),
        viewModel = require('durandal/viewModel');

    var modals = ko.observableArray([]);
    var modalActivator = viewModel.activator().forItems(modals);

    return {
        modals: modals,
        activator: modalActivator,
        currentZIndex: 1000,
        removeDelay: 200,
        blockoutOpacity: .2,
        getNextZIndex: function() {
            return ++this.currentZIndex;
        },
        addHost: function(modalWindow) {
            var body = $('body');
            var blockout = $('<div class="modalBlockout"></div>')
                .css({ 'z-index': this.getNextZIndex(), 'opacity': this.blockoutOpacity })
                .appendTo(body);

            var host = $('<div class="modalHost"></div>')
                .css({ 'z-index': this.getNextZIndex() })
                .appendTo(body);

            modalWindow.host = host.get(0);
            modalWindow.blockout = blockout.get(0);
        },
        removeHost: function(modalWindow) {
            $(modalWindow.host).css('opacity', 0);
            $(modalWindow.blockout).css('opacity', 0);

            setTimeout(function() {
                $(modalWindow.host).remove();
                $(modalWindow.blockout).remove();
            }, this.removeDelay);
        },
        afterCompose: function(parent, newChild, settings) {
            var $child = $(newChild);
            var width = $child.width();
            var height = $child.height();

            $child.css({
                'margin-top': (-height / 2).toString() + 'px',
                'margin-left': (-width / 2).toString() + 'px'
            });

            $(settings.model.window.host).css('opacity', 1);
        },
        createCompositionSettings: function(obj) {
            var settings = obj;
            var moduleId = system.getModuleId(obj);

            if (moduleId) {
                settings = {
                    model: obj
                };
            }

            settings.activate = false;
            settings.afterCompose = this.afterCompose;

            return settings;
        },
        show: function(obj) {
            var that = this;
            return system.defer(function(dfd) {
                modalActivator.activateItem(obj).then(function(success) {
                    if (success) {
                        var modalWindow = obj.window = {
                            close: function(result) {
                                modalActivator.deactivateItem(obj, true).then(function(closeSuccess) {
                                    if (closeSuccess) {
                                        that.removeHost(modalWindow);
                                        dfd.resolve(result);
                                    }
                                });
                            }
                        };

                        that.addHost(modalWindow);
                        composition.compose(modalWindow.host, that.createCompositionSettings(obj));
                    } else {
                        dfd.resolve(false);
                    }
                });
            }).promise();
        }
    };
});