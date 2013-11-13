define(['knockout'], function (ko) {
    var itemToAdd = ko.observable("");
    var allItems = ko.observableArray(["Fries", "Eggs Benedict", "Ham", "Cheese"]);
    var selectedItems = ko.observableArray(["Ham"]);

    return {
        itemToAdd: itemToAdd,
        allItems: allItems,
        selectedItems: selectedItems,
        addItem: function () {
            var value = itemToAdd();

            if (value != "" && allItems.indexOf(value) < 0){ // Prevent blanks and duplicates
                allItems.push(value);
            }

            itemToAdd(""); // Clear the text box
        },
        removeSelected: function () {
            allItems.removeAll(selectedItems());
            selectedItems([]); // Clear selection
        },
        sortItems: function () {
            allItems.sort();
        }
    }
});