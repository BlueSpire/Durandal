define(['durandal/app'], function (app) {

        var itemToAdd = ko.observable("");
        var allItems = ko.observableArray(["Fries", "Eggs Benedict", "Ham", "Cheese"]); // Initial items
        var selectedItems = ko.observableArray(["Ham"]);                                // Initial selection

        var addItem = function () {
            if ((itemToAdd() != "") && (allItems.indexOf(itemToAdd()) < 0)) // Prevent blanks and duplicates
                allItems.push(itemToAdd());
            itemToAdd(""); // Clear the text box
        };

        var removeSelected = function () {
            allItems.removeAll(selectedItems());
            selectedItems([]); // Clear selection
        };

        var sortItems = function () {
            allItems.sort();
        };

        return {
            itemToAdd: itemToAdd,
            allItems: allItems,
            selectedItems: selectedItems,
            addItem: addItem,
            removeSelected: removeSelected,
            sortItems: sortItems
        }
});