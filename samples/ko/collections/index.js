define(['durandal/system', 'knockout'], function(system, ko) {
    // Define a "Person" class that tracks its own name and children, and has a method to add a new child
    var Person = function (name, children) {
        this.name = name;
        this.children = ko.observableArray(children);

        this.addChild = function () {
            this.children.push("New Child");
        }.bind(this);
    };

    return {
        people:[
            new Person("Annabelle", ["Arnie", "Anders", "Apple"]),
            new Person("Bertie", ["Boutros-Boutros", "Brianna", "Barbie", "Bee-bop"]),
            new Person("Charles", ["Cayenne", "Cleopatra"])
        ],
        showRenderTimes : ko.observable(false)
    }
});