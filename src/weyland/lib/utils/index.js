exports.merge = function() {
    var final = {};

    for(var i = 0, len = arguments.length; i < len; i++){
        var current = arguments[i];
        if(current){
            for(var key in current){
                var value = current[key];
                try{
                    if (value.constructor == Object) {
                        final[key] = merge(final[key], value);
                    } else {
                        final[key] = value;
                    }
                }
                catch(e){
                    final[key] = value;
                }
            }
        }
    }

    return final;
};