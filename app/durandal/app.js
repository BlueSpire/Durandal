define(['durandal/composition', 'durandal/modal', 'durandal/messageBox', 'durandal/events'], function() {
    var system = require('durandal/system'),
        viewLocator = require('durandal/viewLocator'),
        composition = require('durandal/composition'),
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
            composition.compose(hostElement, { model:root, activate:true });
        },
        makeFit: function() {
            if (document.body.ontouchmove) {
                document.body.ontouchmove = function(event) {
                    event.preventDefault();
                };
            }

            if (document.body.onorientationchange) {
                document.body.onorientationchange = function(event) {

                };
            }
        }
    };

    Events.includeIn(app);

    return app;
});