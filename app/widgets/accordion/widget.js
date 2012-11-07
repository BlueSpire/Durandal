define(function (require) {
    var ctor = function (element, settings) {
        this.context = settings;

        console.log(this.context);
    };

    return ctor;
});