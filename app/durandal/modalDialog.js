define(function(require) {
    var composition = require('durandal/composition'),
        system = require('durandal/system'),
        viewModel = require('durandal/viewModel');

    var contexts = {};

    var modalDialog = {
        getContext: function(name) {
            return contexts[name || 'default'];
        },
        addContext: function(name, modalContext) {
            modalContext.name = name;
            modalContext.modals = ko.observableArray([]);
            modalContext.activator = viewModel.activator().forItems(modalContext.modals);

            contexts[name] = modalContext;

            var helperName = 'show' + name.substr(0, 1).toUpperCase() + name.substr(1);
            this[helperName] = function(obj) {
                return this.show(obj, name);
            };
        },
        createCompositionSettings: function(obj, modalContext) {
            var settings = obj;
            var moduleId = system.getModuleId(obj);

            if (moduleId) {
                settings = {
                    model: obj
                };
            }

            settings.activate = false;

            if (modalContext.afterCompose) {
                settings.afterCompose = modalContext.afterCompose;
            }

            return settings;
        },
        show: function(obj, context) {
            var that = this;
            var modalContext = contexts[context || 'default'];
            return system.defer(function(dfd) {
                modalContext.activator.activateItem(obj).then(function(success) {
                    if (success) {
                        var modal = obj.modal = {
                            owner: obj,
                            context: modalContext,
                            close: function(result) {
                                modalContext.activator.deactivateItem(obj, true).then(function(closeSuccess) {
                                    if (closeSuccess) {
                                        modalContext.removeHost(modal);
                                        dfd.resolve(result);
                                    }
                                });
                            }
                        };

                        modal.settings = that.createCompositionSettings(obj, modalContext);
                        modalContext.addHost(modal);

                        composition.compose(modal.host, modal.settings);
                    } else {
                        dfd.resolve(false);
                    }
                });
            }).promise();
        }
    };

    modalDialog.addContext('default', {
        currentZIndex: 1000,
        blockoutOpacity: .2,
        removeDelay: 200,
        getNextZIndex: function() {
            return ++this.currentZIndex;
        },
        addHost: function(modal) {
            var body = $('body');
            var blockout = $('<div class="modalBlockout"></div>')
                .css({ 'z-index': this.getNextZIndex(), 'opacity': this.blockoutOpacity })
                .appendTo(body);

            var host = $('<div class="modalHost"></div>')
                .css({ 'z-index': this.getNextZIndex() })
                .appendTo(body);

            modal.host = host.get(0);
            modal.blockout = blockout.get(0);
        },
        removeHost: function(modal) {
            $(modal.host).css('opacity', 0);
            $(modal.blockout).css('opacity', 0);

            setTimeout(function() {
                $(modal.host).remove();
                $(modal.blockout).remove();
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

            $(settings.model.modal.host).css('opacity', 1);
        }
    });

    return modalDialog;
});