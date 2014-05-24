define(['durandal/system', 'durandal/binder', 'require', 'jquery', 'knockout'], function (system, binder, require, $, ko) {
    var modules = {};
    var mainConfig;
    var i18n = {};

    i18n.install = function (config) {
        mainConfig = config || {};

        if (!ko.bindingHandlers.i18n) {
            ko.bindingHandlers.i18n = {
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    $(element).text(bindingContext.$root.__i18n__()[ko.unwrap(valueAccessor())]);
                }
            };
        }

        binder.binding = function (obj) {
            var moduleId = obj.__moduleId__;
            if (!modules[moduleId]) {
                modules[moduleId] = ko.observable({});
                system.acquire(moduleId + "." + mainConfig.culture).then(function (data) {
                    modules[moduleId](data);
                });
            }

            obj.__i18n__ = modules[moduleId];
        };
    };

    i18n.changeCulture = function (culture) {
        mainConfig.culture = culture;

        for (var moduleId in modules) {
            if (modules.hasOwnProperty(moduleId)) {
                system.acquire(moduleId + "." + mainConfig.culture).then(function (data) {
                    modules[moduleId](data);
                });
            }
        }
    };
  

    return i18n;
});