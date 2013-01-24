define(function(require) {
    var system = require('./system'),
        viewEngine = require('./viewEngine'),
        composition = require('./composition'),
        widget = require('./widget'), //loads the widget handler
        dom = require('./dom'),
        modalDialog = require('./modalDialog'),
        Events = require('./events');

    var MessageBox;

    var app = {
        showModal: function(obj, activationData, context) {
            return modalDialog.show(obj, activationData, context);
        },
        showMessage: function(message, title, options) {
            return modalDialog.show(new MessageBox(message, title, options));
        },
        start: function() {
            return system.defer(function(dfd) {
                dom.ready().then(function() {
                    system.log('Starting Application');
                    system.acquire('./messageBox').then(function(mb) {
                        MessageBox = mb;
                        dfd.resolve();
                        system.log('Started Application');
                    });
                });
            }).promise();
        },
        setRoot: function(root, transition, applicationHost) {
            var hostElement,
                settings = { activate: true, transition: transition };

            if (!applicationHost || typeof applicationHost == "string") {
                hostElement = dom.getElementById(applicationHost || 'applicationHost');
            } else {
                hostElement = applicationHost;
            }

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
        adaptToDevice: function() {
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