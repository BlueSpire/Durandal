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
        serialize: function(object, space) {
            return JSON.stringify(object, this.replacer, space || this.space);
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