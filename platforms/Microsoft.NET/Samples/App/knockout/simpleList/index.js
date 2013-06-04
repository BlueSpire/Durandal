define(['durandal/app'], function (app) {
        
        var initialData = ["Alpha", "Beta", "Gamma"];

        var items = ko.observableArray(initialData);
        var itemToAdd = ko.observable("");

        var addItem = function () {
            if (itemToAdd() != "") {
                items.push(itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
                itemToAdd(""); // Clears the text box, because it's bound to the "itemToAdd" observable
            };
        };

        return  {
            items: items,
            itemToAdd: itemToAdd,
            addItem: addItem
        }
});