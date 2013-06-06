define(['durandal/system', 'durandal/app'], function(system, app) {

    // Define a "Person" class that tracks its own name and children, and has a method to add a new child
    var Person = function (name, children) {
        this.name = name;
        this.children = ko.observableArray(children);

        this.addChild = function () {
            this.children.push("New child");
        }.bind(this);
    }

    function viewAttached(view) {
        system.log('View Activating', this);
    }

    // The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)

    return {
        people : [
            new Person("Annabelle", ["Arnie", "Anders", "Apple"]),
            new Person("Bertie", ["Boutros-Boutros", "Brianna", "Barbie", "Bee-bop"]),
            new Person("Charles", ["Cayenne", "Cleopatra"])
        ],
        showRenderTimes : ko.observable(false),
        viewAttached : viewAttached
    }
});