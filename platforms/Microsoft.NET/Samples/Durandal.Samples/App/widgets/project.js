define('widgets/project', function () {
    return function(name, description) {
        this.name = name;
        this.description = description;
    };
});