define(['jquery', 'knockout'], function ($, ko) {
    // Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
    // Could be stored in a separate utility library
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function (element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    var planets = ko.observableArray([
        { name: "Mercury", type: "rock" },
        { name: "Venus", type: "rock" },
        { name: "Earth", type: "rock" },
        { name: "Mars", type: "rock" },
        { name: "Jupiter", type: "gasgiant" },
        { name: "Saturn", type: "gasgiant" },
        { name: "Uranus", type: "gasgiant" },
        { name: "Neptune", type: "gasgiant" },
        { name: "Pluto", type: "rock" }
    ]);

    var typeToShow = ko.observable("all");

    return {
        planets: planets,
        typeToShow: typeToShow,
        displayAdvancedOptions: ko.observable(false),
        addPlanet: function (type) {
            planets.push({
                name: "New planet",
                type: type
            });
        },
        planetsToShow: ko.computed(function () {
            // Represents a filtered list of planets
            // i.e., only those matching the "typeToShow" condition
            var desiredType = typeToShow();
            if (desiredType == "all") {
                return planets();
            }

            return ko.utils.arrayFilter(planets(), function (planet) {
                return planet.type == desiredType;
            });
        }),
        showPlanetElement: function (elem) {
            if (elem.nodeType === 1) {
                $(elem).hide().slideDown()
            }
        },
        hidePlanetElement: function (elem) {
            if (elem.nodeType === 1) {
                $(elem).slideUp(function () { $(elem).remove(); })
            }
        }
    }
});