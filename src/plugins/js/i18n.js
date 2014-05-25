define(['durandal/system', 'durandal/binder', 'require', 'jquery', 'knockout'], function (system, binder, require, $, ko) {
    var modules = {};
    var mainConfig;
    var i18n = {};

    i18n.install = function (config) {
        mainConfig = config || {};

        if (!ko.bindingHandlers.i18n) {
            ko.bindingHandlers.i18n = {
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var accessors = ko.unwrap(valueAccessor()).split(".");
                    var data = bindingContext.$root.__i18n__();

                    for (var cpt = 0; cpt < accessors.length; cpt++) {
                        var value = data[accessors[cpt]];
                        if (value !== undefined) {
                            data = value;
                        } else {
                            data = undefined;
                            break;
                        }
                    }

                    if (data !== undefined) {
                        $(element).text(data);
                    } else {
                        // [TODO] Report missing resource.
                    }
                }
            };
        }

        binder.binding = function (obj) {
            var moduleId = obj.__moduleId__;
            if (!modules[moduleId]) {
                modules[moduleId] = ko.observable({});
            }

            obj.__i18n__ = modules[moduleId];

            getModules(moduleId);
        };
    };

    i18n.changeCulture = function (culture) {
        mainConfig.culture = culture;

        for (var moduleId in modules) {
            if (modules.hasOwnProperty(moduleId)) {
                getModules(moduleId);
            }
        }
    };
  
    function getModules(moduleId) {
        var cultureParts = mainConfig.culture.split("-");
        
        var computedData = {
            queryCounter: cultureParts.length + 1,
            results: []
        };

        var culturePart = "";

        getModule(moduleId, "root", computedData, 0);

        for (var cptParts = 0; cptParts < cultureParts.length; cptParts++) {
            culturePart = (!culturePart ? "" : culturePart + "-") + cultureParts[cptParts];
            getModule(moduleId, culturePart, computedData, cptParts + 1);
        }
    }

    function getModule(moduleId, culturePart, computedData, cpt) {
        system.acquire(moduleId + "." + culturePart).then(function (data) {
            computedData.results[cpt] = data;
            computedData.queryCounter--;
            completeModule(moduleId, computedData);
        }, function (error) {
            // [TODO] Report missing resource file.
            computedData.queryCounter--;
            completeModule(moduleId, computedData);
        });
    }

    function completeModule(moduleId, computedData) {
        if (computedData.queryCounter === 0) {
            modules[moduleId]($.extend.apply($, [true, {}].concat(computedData.results)));
        }
    }

    return i18n;
});