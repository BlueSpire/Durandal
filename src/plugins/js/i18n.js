define(['durandal/system', 'durandal/binder', 'require', 'jquery', 'knockout'], function (system, binder, require, $, ko) {
    var modules;
    var mainConfig;
    var i18n = {};

    i18n.install = function (config) {
        mainConfig = config || {};
        modules = {};
        
        if (mainConfig.globalModules) {
            if ($.isArray(mainConfig.globalModules)) {
                for (var cpt = 0; cpt < mainConfig.globalModules.length; cpt++) {
                    prepareModule(mainConfig.globalModules[cpt]);
                }
            } else {
                prepareModule(mainConfig.globalModules);
            }
        }

        if (!ko.bindingHandlers.i18n) {
            ko.bindingHandlers.i18n = {
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var data = bindingContext.$root.__i18n__();

                    var value = getValueInternal(data, ko.unwrap(valueAccessor()));

                    if (value !== undefined) {
                        $(element).text(data);
                    }
                }
            };
        }

        binder.binding = function (obj) {
            prepareModule(obj);
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

    i18n.getValue = function (module, key, callback) {
        if (module && key) {
            if ($.type(module) !== "string" && module.__moduleId__) {
                module = module.__moduleId__;
            }

            if (modules[module] !== undefined) {
                if (modules[module].queryCounter === 0) {
                    var value = getValueInternal(modules[module].data(), key);
                    if (callback) {
                        callback(value);
                        return;
                    } else {
                        return system.defer(function (dfd) { dfd.resolve(value); });
                    }
                } else {
                    if (callback) {
                        modules[module].callbacks.push(function (data) {
                            callback(getValueInternal(data, key));
                        });

                        return;
                    } else {
                        var dfd = system.defer();

                        modules[module].callbacks.push(function (data) {
                            dfd.resolve(getValueInternal(data, key));
                        });

                        return dfd;
                    }
                }
            }
        }
        
        if (callback) {
            callback(undefined);
        } else {
            return system.defer(function (dfd) { dfd.resolve(undefined); });
        }
    }

    function prepareModule(module) {
        var moduleId = module;

        if ($.type(moduleId) !== "string") {
            moduleId = system.getModuleId(module);
        }

        if (!modules[moduleId]) {
            modules[moduleId] = {
                data: ko.observable({}),
                queryCounter: 999
            }

            getModules(moduleId);
        }

        if ($.type(moduleId) !== "string") {
            module.__i18n__ = modules[moduleId].data;
        }
    }

    function getModules(moduleId) {
        var cultureParts = mainConfig.culture.split("-");
        var module = modules[moduleId];

        module.queryCounter = cultureParts.length + 1;
        module.callbacks = [];
        module.files = [];

        var culturePart = "";

        getModule(moduleId, "root", 0);

        for (var cptParts = 0; cptParts < cultureParts.length; cptParts++) {
            culturePart = (!culturePart ? "" : culturePart + "-") + cultureParts[cptParts];
            getModule(moduleId, culturePart, cptParts + 1);
        }
    }

    function getModule(moduleId, culturePart, cpt) {
        var module = modules[moduleId];
        system.acquire(moduleId + "." + culturePart).then(function (data) {
            module.files[cpt] = data;
            module.queryCounter--;
            completeModule(moduleId);
        }, function (error) {
            // [TODO] Report missing resource file.
            module.queryCounter--;
            completeModule(moduleId);
        });
    }

    function completeModule(moduleId, computedData) {
        var module = modules[moduleId];

        // If we received all the resource files...
        if (module.queryCounter === 0) {
            // Build final resource file from all files
            module.data($.extend.apply($, [true, {}].concat(module.files)));

            // Callback all getValue methods registered before we got the resources
            for (var cptCallbacks = 0; cptCallbacks < module.callbacks.length; cptCallbacks++) {
                module.callbacks[0](module.data());
            }

            // Clear temporary files and callbacks
            module.files = null;
            module.callbacks = null;
        }
    }

    function getValueInternal(data, keys) {
        var isKeyArray = true;

        if (!$.isArray(keys)) {
            keys = [keys];
            isKeyArray = false;
        }

        var results = [];

        for (var cptKeys = 0; cptKeys < keys.length; cptKeys++) {
            var key = keys[cptKeys];
            var keyParts = key.split(".");

            var value = data;

            for (var cptKeyParts = 0; cptKeyParts < keyParts.length; cptKeyParts++) {
                value = value[keyParts[cptKeyParts]];

                if (value === undefined) {
                    // [TODO] Report missing resource.
                    break;
                }
            }

            results.push(value);
        }

        if (isKeyArray) {
            return results;
        } else {
            return results[0];
        }
    }

    return i18n;
});