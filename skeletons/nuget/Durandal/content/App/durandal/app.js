define(function(require) {
    var system = require('./system'),
        viewEngine = require('./viewEngine'),
        composition = require('./composition'),
        widget = require('./widget'), //loads the widget handler
        modalDialog = require('./modalDialog'),
        Events = require('./events');

    var MessageBox,
        defaultTitle = 'Application';

    var app = {
        title: defaultTitle,
        showModal: function(obj, activationData, context) {
            return modalDialog.show(obj, activationData, context);
        },
        showMessage: function(message, title, options) {
            return modalDialog.show(new MessageBox(message, title, options));
        },
        start: function() {
            var that = this;
            if (that.title) {
                document.title = that.title;
            }

            return system.defer(function (dfd) {
                $(function() {
                    system.log('Starting Application');
                    system.acquire('./messageBox').then(function (mb) {
                        MessageBox = mb;
                        MessageBox.defaultTitle = that.title || defaultTitle;
                        dfd.resolve();
                        system.log('Started Application');
                    });
                });
            }).promise();
        },
        setRoot: function(root, transition, applicationHost) {
            var hostElement, settings = { activate: true, transition: transition };

            if (!applicationHost || typeof applicationHost == "string") {
                hostElement = document.getElementById(applicationHost || 'applicationHost');
            } else {
                hostElement = applicationHost;
            }

            if (typeof root === 'string') {
                if (viewEngine.isViewUrl(root)) {
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