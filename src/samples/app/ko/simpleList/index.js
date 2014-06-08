define(['knockout'], function (ko) {
    var items = ko.observableArray(["Alpha", "Beta", "Gamma"]);
    var itemToAdd = ko.observable("");

    return  {
        items: items,
        itemToAdd: itemToAdd,
        addItem: function () {
            if (itemToAdd() != '') {
                items.push(itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
                itemToAdd(''); // Clears the text box, because it's bound to the "itemToAdd" observable
            };
        }
    }
});