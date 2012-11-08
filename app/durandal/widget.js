define(function (require) {
    var system = require('durandal/system'),
        viewEngine = require('durandal/viewEngine'),
        composition = require('durandal/composition'),
        viewLocator = require('durandal/viewLocator'),
        viewModelBinder = require('durandal/viewModelBinder');
    
    var widget = {
        getSettings: function(valueAccessor) {
            var settings = { },
                value = ko.utils.unwrapObservable(valueAccessor()) || { };

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
        registerKind: function (kind) {
            ko.bindingHandlers[kind] = {
                update: function (element, valueAccessor) {
                    var settings = widget.getSettings(valueAccessor);
                    settings.kind = kind;
                    widget.create(element, settings);
                }
            };

            ko.virtualElements.allowedBindings[kind] = true;
        },
        convertKindIdToWidgetUrl: function (kind) {
            //todo: map to global widget re-defines for kinds
            return "widgets/" + kind + "/widget";
        },
        convertKindIdToViewUrl: function (kind) {
            //todo: map to global view re-defines for kinds
            return "widgets/" + kind + "/widget" + viewEngine.viewExtension;
        },
        create: function (element, settings) {
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
                        //any local overrides for templated parts ? create new view and merge in parts

                        viewModelBinder.bind(widgetInstance, view);
                        composition.switchContent(element, view, { model: widgetInstance });
                    });
                }
            });
        }
    };

    ko.bindingHandlers.widget = {
        update: function (element, valueAccessor) {
            var settings = widget.getSettings(valueAccessor);
            widget.create(element, settings);
        }
    };

    ko.virtualElements.allowedBindings.widget = true;

    return widget;
});