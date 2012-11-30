define(function(require) {
    var system = require('durandal/system'),
        viewEngine = require('durandal/viewEngine'),
        composition = require('durandal/composition'),
        dom = require('durandal/dom');

    var widgetPartAttribute = 'data-widget-part',
        widgetPartSelector = "[" + widgetPartAttribute + "]";

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
        getParts: function(elements) {
            var parts = {};

            if (!system.isArray(elements)) {
                elements = [elements];
            }

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];

                if (element.getAttribute) {
                    var id = element.getAttribute(widgetPartAttribute);
                    if (id) {
                        parts[id] = element;
                    }

                    var childParts = $(widgetPartSelector, element);

                    for (var j = 0; j < childParts.length; j++) {
                        var part = childParts.get(j);
                        parts[part.getAttribute(widgetPartAttribute)] = part;
                    }
                }
            }

            return parts;
        },
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
        convertKindToModuleId: function(kind) {
            //todo: map to global widget re-defines for kinds
            return "widgets/" + kind + "/widget";
        },
        convertKindToView: function(kind) {
            //todo: map to global view re-defines for kinds
            return "widgets/" + kind + "/widget" + viewEngine.viewExtension;
        },
        beforeBind: function(element, view, settings) {
            finalizeWidgetView(view, findReplacementParts(element));
        },
        createCompositionSettings: function(settings) {
            if (!settings.model) {
                settings.model = this.convertKindToModuleId(settings.kind);
            }

            if (!settings.view) {
                settings.view = this.convertKindToView(settings.kind);
            }

            settings.preserveContext = true;
            settings.beforeBind = this.beforeBind;
            
            return settings;
        },
        create: function(element, settings, bindingContext) {
            if (typeof settings == 'string') {
                settings = {
                    kind: settings
                };
            }

            var compositionSettings = widget.createCompositionSettings(settings);
            composition.compose(element, compositionSettings, bindingContext);
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