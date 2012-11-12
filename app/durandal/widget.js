define(function(require) {
    var system = require('durandal/system'),
        viewEngine = require('durandal/viewEngine'),
        composition = require('durandal/composition'),
        viewLocator = require('durandal/viewLocator'),
        viewModelBinder = require('durandal/viewModelBinder');

    //some magic regex based on knockout virtual elements
    var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";
    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*part\s([A-Za-z]*)\s*-->$/ : /^\s*part\s([A-Za-z]*)\s*$/;
    var endCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*\/part\s*-->$/ : /^\s*\/part\s*$/;

    function isPartStart(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
    }

    function isPartEnd(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex);
    }

    function searchDom(element, matcher) {
        if (matcher(element)) {
            return element;
        }

        if (element.hasChildNodes()) {
            var child = element.firstChild;
            while (child) {
                if (matcher(child)) {
                    return child;
                }

                if (child.nodeType === 1) {
                    return searchDom(child);
                }

                child = child.nextSibling;
            }
        }

        return null;
    }

    function gatherViewParts(element) {
        var children = element.childNodes;
        var parts = [];

        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            var match = isPartStart(node);

            if (match) {
                var part = {
                    name: match[1],
                    nodes: []
                };

                parts.push(part);
                part.nodes.push(node);

                i++;

                for (; i < children.length; i++) {
                    node = children[i];
                    part.nodes.push(node);

                    if (isPartEnd(node)) {
                        break;
                    }
                }
            }
        }

        return parts;
    }

    function replaceViewParts(view, parts) {
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var partName = part.name;

            var replaceStart = searchDom(view, function(node) {
                var match = isPartStart(node);
                return match && match[1] == partName;
            });

            if (replaceStart) {
                var newNodes = part.nodes;
                for (var j = 0; j < newNodes.length; j++) {
                    view.insertBefore(newNodes[j], replaceStart);
                }

                var toRemove = replaceStart;
                while (!isPartEnd(toRemove)) {
                    var sibling = toRemove.nextSibling;
                    toRemove.parentNode.removeChild(toRemove);
                    toRemove = sibling;
                }

                toRemove.parentNode.removeChild(toRemove);
            }
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
                update: function(element, valueAccessor) {
                    var settings = widget.getSettings(valueAccessor);
                    settings.kind = kind;
                    widget.create(element, settings);
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
        create: function(element, settings) {
            var that = this;

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
                        var parts = gatherViewParts(element);
                        replaceViewParts(view, parts);
                        viewModelBinder.bind(widgetInstance, view);
                        composition.switchContent(element, view, { model: widgetInstance });
                    });
                }
            });
        }
    };

    ko.bindingHandlers.widget = {
        update: function(element, valueAccessor) {
            var settings = widget.getSettings(valueAccessor);
            widget.create(element, settings);
        }
    };

    ko.virtualElements.allowedBindings.widget = true;

    return widget;
});