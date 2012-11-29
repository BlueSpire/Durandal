define(function(require) {
    var system = require('durandal/system'),
        viewEngine = require('durandal/viewEngine'),
        composition = require('durandal/composition'),
        viewLocator = require('durandal/viewLocator'),
        viewModelBinder = require('durandal/viewModelBinder'),
        dom = require('durandal/dom');

    var widgetPartAttribute = 'data-widget-part';

    function isPart(node) {
        return node.nodeName == 'PART' || node.nodeName == 'part';
    }

    function findAllParts(element, parts) {
        if (isPart(element)) {
            parts.push({
                id: element.getAttribute('id'),
                node: element
            });
            return;
        }

        if (element.hasChildNodes()) {
            var child = element.firstChild;
            while (child) {
                if (isPart(child)) {
                    parts.push({
                        id: child.getAttribute('id'),
                        node: child
                    });
                } else if (child.nodeType === 1) {
                    findAllParts(child, parts);
                }

                child = child.nextSibling;
            }
        }
    }

    function findReplacementParts(element) {
        var children = element.childNodes;
        var parts = {};

        for (var i = 0; i < children.length; i++) {
            var node = children[i];

            if (isPart(node)) {
                parts[node.getAttribute('id')] = node.innerHTML;
            }
        }

        return parts;
    }

    function finalizeWidgetView(view, replacementParts) {
        var parts = [];

        findAllParts(view, parts);

        for (var i = 0; i < parts.length; i++) {
            var current = parts[i];
            var html = replacementParts[current.id] || current.node.innerHTML;

            var partView = dom.parseHTML(html);
            partView.setAttribute(widgetPartAttribute, current.id);
            current.node.parentNode.replaceChild(partView, current.node);

            finalizeWidgetView(partView, replacementParts);
        }
    }

    var widget = {
        getSettings: function(valueAccessor) {
            var settings = {},
                value = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (typeof value == 'string') {
                settings = value;
            } else {
                for (var attrName in value) {
                    if (typeof attrName == 'string') {
                        var attrValue = ko.utils.unwrapObservable(value[attrName]);
                        settings[attrName] = attrValue;
                    }
                }
            }

            return settings;
        },
        registerKind: function(kind) {
            ko.bindingHandlers[kind] = {
                init: function() {
                    return { controlsDescendantBindings: true };
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var settings = widget.getSettings(valueAccessor);
                    settings.kind = kind;
                    widget.create(element, settings, bindingContext);
                }
            };

            ko.virtualElements.allowedBindings[kind] = true;
        },
        convertKindIdToWidgetUrl: function(kind) {
            //todo: map to global widget re-defines for kinds
            return "widgets/" + kind + "/widget";
        },
        convertKindIdToViewUrl: function(kind) {
            //todo: map to global view re-defines for kinds
            return "widgets/" + kind + "/widget" + viewEngine.viewExtension;
        },
        create: function(element, settings, bindingContext) {
            if (typeof settings == 'string') {
                settings = {
                    kind: settings
                };
            }

            if (!settings.kindUrl) {
                settings.kindUrl = this.convertKindIdToWidgetUrl(settings.kind);
            }

            if (!settings.viewUrl) {
                settings.viewUrl = this.convertKindIdToViewUrl(settings.kind);
            }

            system.acquire(settings.kindUrl).then(function(widgetFactory) {
                var widgetInstance = new widgetFactory(element, settings);

                if (settings.viewUrl) {
                    viewLocator.locateView(settings.viewUrl).then(function(view) {
                        finalizeWidgetView(view, findReplacementParts(element));

                        if (bindingContext) {
                            viewModelBinder.bindContext(bindingContext, view, widgetInstance);
                        } else {
                            viewModelBinder.bind(widgetInstance, view);
                        }
                        
                        composition.switchContent(element, view, { model: widgetInstance });
                    });
                }
            });
        }
    };

    ko.bindingHandlers.widget = {
        init: function() {
            return { controlsDescendantBindings: true };
        },
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var settings = widget.getSettings(valueAccessor);
            widget.create(element, settings, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.widget = true;

    return widget;
});