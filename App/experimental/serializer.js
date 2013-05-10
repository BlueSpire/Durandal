define(['../durandal/system'], function(system) {
    var removedKeys = ['__moduleId__', '__observable__'];

    return {
        defaultTypeAttribute: 'type',
        removedKeys: removedKeys,
        replacer: function(key, value) {
            if (removedKeys.indexOf(key) != -1) {
                return undefined;
            }

            return value;
        },
        serialize: function(object, space) {
            return JSON.stringify(object, this.replacer, space);
        },
        getTypeId: function(object) {
            if (object) {
                return object[this.defaultTypeAttribute];
            }

            return undefined;
        },
        typeMap: {},
        registerType: function() {
            var first = arguments[0];

            if (arguments.length == 1) {
                var id = first[this.defaultTypeAttribute] || system.getModuleId(first);
                this.typeMap[id] = first;
            } else {
                this.typeMap[first] = arguments[1];
            }
        },
        reviver: function(key, value) {
            var typeId = this.getTypeId(value);
            if (typeId) {
                var registered = this.typeMap[typeId];
                if (registered) {
                    if (registered.fromJSON) {
                        return registered.fromJSON(value);
                    }

                    return new registered(value);
                }
            }

            return value;
        },
        deserialize: function(string) {
            var that = this;
            return JSON.parse(string, function(key, value) {
                return that.reviver(key, value);
            });
        }
    };
});