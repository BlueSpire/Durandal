﻿define(function(require) {
    var system = require('./system'),
        viewEngine = require('./viewEngine'),
        composition = require('./composition'),
        widget = require('./widget'), //loads the widget handler
        dom = require('./dom'),
        modalDialog = require('./modalDialog'),
        MessageBox = require('./messageBox'),
        Events = require('./events');

    var app = {
        showModal: function(viewModel) {
            return modalDialog.show(viewModel);
        },
        showMessage: function(message, title, options) {
            return modalDialog.show(new MessageBox(message, title, options));
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