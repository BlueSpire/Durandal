define(['../system', '../viewModelBinder'], function(system, viewModelBinder) {
    var nonObservableTypes = ['[object Function]', '[object String]', '[object Boolean]', '[object Number]', '[object Date]', '[object RegExp]'];
    var ignoredProperties = ['__moduleId__', '__observable__'];
    var toString = Object.prototype.toString;
    var observableArrayMethods = ["remove", "removeAll", "destroy", "destroyAll", "replace"];
    var arrayMethods = ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"];
    var arrayProto = Array.prototype;
    var observableArrayFunctions = ko.observableArray.fn;

    function canConvert(value) {
        if (!value || value.nodeType === 1 || value.ko === ko) {
            return false;
        }

        var type = toString.call(value);

        return nonObservableTypes.indexOf(type) == -1 && !(value === true || value === false);
    }

    function isConverted(obj) {
        return obj && obj.__observable__;
    }

    function makeObservableArray(original, observable, deep) {
        original.__observable__ = true;

        observableArrayMethods.forEach(function(methodName) {
            original[methodName] = observableArrayFunctions[methodName].bind(observable);
        });

        arrayMethods.forEach(function(methodName) {
            original[methodName] = function() {
                observable.valueWillMutate();
                var methodCallResult = arrayProto[methodName].apply(original, arguments);
                observable.valueHasMutated();
                return methodCallResult;
            };
        });

        if (deep) {
            for (var i = 0; i < original.length; i++) {
                convert(original[i], true);
            }
        }
    }

    function convert(original, deep) {
        if (isConverted(original) || !canConvert(original)) {
            return;
        }

        original.__observable__ = true;

        if (system.isArray(original)) {
            var observable = ko.observableArray(original);
            makeObservableArray(original, observable, deep);
        } else {
            for (var prop in original) {
                convertProperty(original, prop, deep);
            }
        }

        system.log('Converted', original);
    }

    function convertProperty(obj, property, deep) {
        var observable,
            isArray,
            original = obj[property];

        if (ignoredProperties.indexOf(property) != -1) {
            return;
        }

        if (system.isArray(original)) {
            observable = ko.observableArray(original);
            isArray = true;
            makeObservableArray(original, observable, deep);
        } else if (typeof original == "function") {
            return;
        } else {
            observable = ko.observable(original);

            if (deep) {
                convert(original, true);
            }
        }

        //observables are already set up to act getters/setters
        //this actually redefines the existing property on the object that was provided
        Object.defineProperty(obj, property, {
            get: observable,
            set: function(newValue) {
                var val;
                observable(newValue);
                val = observable.peek();

                //if this was originally an observableArray, then always check to see if we need to add/replace the array methods (if newValue was an entirely new array)
                if (isArray) {
                    if (!val.destroyAll) {
                        //don't allow null, force to an empty array
                        if (!val) {
                            val = [];
                            observable(val);
                        }

                        makeObservableArray(val, observable, deep);
                    }
                } else if (deep) {
                    convert(val, true);
                }
            }
        });
    }

    return {
        convertProperty: convertProperty,
        convert: convert,
        isConverted: isConverted,
        getObservable: function(obj, property) {
            //            var desc = Object.getOwnPropertyDescriptor(obj, property);

            //            console.log('observable:' + ko.isObservable(desc.get));
            //            console.log('computed:' + ko.isComputed(desc.get));
            //            console.log('supports subscribe:' + (desc.get.subscribe != undefined).toString());
        },
        install: function() {
            viewModelBinder.beforeBind = function(obj, view) {
                convert(obj, true);
            };
        }
    };
});