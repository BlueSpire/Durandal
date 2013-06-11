define('plugins/serializer', ['durandal/system'],
function(system) {

    return {
        typeAttribute: 'type',
        space:undefined,
        replacer: function(key, value) {
            if(key){
                var first = key[0];
                if(first === '_' || first === '$'){
                    return undefined;
                }
            }

            return value;
        },
        serialize: function(object, settings) {
            settings = (settings === undefined) ? {} : settings;

            if(system.isString(settings)){
                settings = { space:settings }
            }

            return JSON.stringify(object, settings.replacer || this.replacer, settings.space || this.space);
        },
        getTypeId: function(object) {
            if (object) {
                return object[this.typeAttribute];
            }

            return undefined;
        },
        typeMap: {},
        registerType: function() {
            var first = arguments[0];

            if (arguments.length == 1) {
                var id = first[this.typeAttribute] || system.getModuleId(first);
                this.typeMap[id] = first;
            } else {
                this.typeMap[first] = arguments[1];
            }
        },
        reviver: function(key, value, getTypeId, typeMap) {
            var typeId = getTypeId(value);
            if (typeId) {
                var registered = typeMap[typeId];
                if (registered) {
                    if (registered.fromJSON) {
                        return registered.fromJSON(value);
                    }

                    return new registered(value);
                }
            }

            return value;
        },
        deserialize: function(string, settings) {
            var that = this;
            settings = settings || {};

            var getTypeId = settings.getTypeId || function(object) { return that.getTypeId(object); };
            var typeMap = settings.typeMap || that.typeMap;
            var reviver = settings.reviver || function(key, value) { return that.reviver(key, value, getTypeId, typeMap); };

            return JSON.parse(string, reviver);
        }
    };
});
