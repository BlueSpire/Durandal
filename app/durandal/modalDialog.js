define(function(require) {
    var composition = require('durandal/composition'),
        system = require('durandal/system'),
        viewModel = require('durandal/viewModel');

    var modals = ko.observableArray([]);
    var modalActivator = viewModel.activator().forItems(modals);

    var defaultModalContext = {
        currentZIndex: 1000,
        blockoutOpacity: .2,
        removeDelay: 200,
        getNextZIndex: function() {
            return ++this.currentZIndex;
        },
        addHost: function (modal) {
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
        removeHost: function (modal) {
            $(modal.host).css('opacity', 0);
            $(modal.blockout).css('opacity', 0);

            setTimeout(function () {
                $(modal.host).remove();
                $(modal.blockout).remove();
            }, this.removeDelay);
        },
        afterCompose: function (parent, newChild, settings) {
            var $child = $(newChild);
            var width = $child.width();
            var height = $child.height();

            $child.css({
                'margin-top': (-height / 2).toString() + 'px',
                'margin-left': (-width / 2).toString() + 'px'
            });

            $(settings.model.modal.host).css('opacity', 1);
        }
    };

    return {
        modals: modals,
        activator: modalActivator,
        contexts: {
            'default': defaultModalContext
        },
        addContext: function (name, modalContext) {
            var helperName = 'show' + text.substr(0, 1).toUpperCase() + text.substr(1)
            this.contexts[name] = modalContext;
            this[helperName] = function (obj) {
                return this.show(obj, name);
            }
        },
        createCompositionSettings: function (obj, modalContext) {
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
        show: function (obj, context) {
            var that = this;
            var modalContext = this.contexts[context || 'default'];
            return system.defer(function(dfd) {
                modalActivator.activateItem(obj).then(function(success) {
                    if (success) {
                        var modal = obj.modal = {
                            close: function(result) {
                                modalActivator.deactivateItem(obj, true).then(function(closeSuccess) {
                                    if (closeSuccess) {
                                        modalContext.removeHost(modal);
                                        dfd.resolve(result);
                                    }
                                });
                            }
                        };

                        modalContext.addHost(modal);
                        composition.compose(modal.host, that.createCompositionSettings(obj, modalContext));
                    } else {
                        dfd.resolve(false);
                    }
                });
            }).promise();
        }
    };
});