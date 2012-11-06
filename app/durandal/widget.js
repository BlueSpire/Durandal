define(function (require) {
    var viewEngine = require('durandal/viewEngine');
    
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
        convertKindIdToWidgetUrl: function (kind) {
            return "widgets/" + kind + "/widget";
        },
        convertKindIdToViewUrl: function (kind) {
            return "widgets/" + kind + "/widget" + viewEngine.viewExtension;
        },
        create: function (element, settings, fallbackModel) {
            var that = this;

            if (typeof settings == 'string') {
                settings = {
                    kind: settings
                };
            }

            if (!settings.kindUrl) {
                settings.kindUrl = this.convertKindIdToWidgetUrl(settings.kind);
            }
            
            if (!settings.templateUrl) {
                settings.templateUrl = this.convertKindIdToViewUrl(settings.kind);
            }

            //acquire widget code
            //acquire widget template
            
            //allow widget to fix up settings

            var widgetViewModel = {
                widget: null,
                settings: null
            };
        }
    };

    ko.bindingHandlers.widget = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var settings = widget.getSettings(valueAccessor);
            widget.create(element, settings, viewModel);
        }
    };

    ko.virtualElements.allowedBindings.widget = true;

    return widget;
});