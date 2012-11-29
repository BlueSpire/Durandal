define(function(require) {
    return function(name, description) {
        this.name = name;
        this.description = description;
        this.toString = function() {
            return name;
        };
    };
});