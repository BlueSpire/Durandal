define(function(require) {
    var system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator'),
        viewEngine = require('durandal/viewEngine'),
        composition = require('durandal/composition'),
        widget = require('durandal/widget'), //loads the widget handler
        dom = require('durandal/dom'),
        Modal = require('durandal/modal'),
        MessageBox = require('durandal/messageBox'),
        Events = require('durandal/events');

    var app = {
        showModal: function(viewModel) {
            return system.defer(function(dfd) {
                viewLocator.locateViewForObject(viewModel)
                    .then(function(view) {
                        new Modal({
                            view: view,
                            viewModel: viewModel
                        }).open().then(dfd.resolve);
                    });
            }).promise();
        },
        showMessage: function(message, title, options) {
            return this.showModal(new MessageBox(message, title, options));
        },
        start: function() {
            return system.defer(function(dfd) {
                system.debug($('meta[name=debug]').attr('content') === 'true');
                dom.ready().then(function() {
                    system.log('Starting Application');
                    dfd.resolve();
                    system.log('Started Application');
                });
            }).promise();
        },
        setRoot: function(root, applicationHost) {
            var hostElement = dom.getElementById(applicationHost || 'applicationHost');
            var settings = { activate: true };

            if (typeof root === 'string') {
                if (root.indexOf(viewEngine.viewExtension) != -1) {
                    settings.view = root;
                } else {
                    settings.model = root;
                }
            } else {
                settings.model = root;
            }

            composition.compose(hostElement, settings);
        },
        makeFit: function() {
            if (document.body.ontouchmove) {
                document.body.ontouchmove = function(event) {
                    event.preventDefault();
                };
            }
        }
    };

    Events.includeIn(app);

    return app;
});