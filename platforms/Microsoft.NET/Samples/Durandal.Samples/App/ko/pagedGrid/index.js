define(['durandal/system', 'durandal/app', './simpleGrid', 'knockout'], function(system, app, SimpleGrid, ko) {
    var initialData = [
        { name: "Well-Travelled Kitten", sales: 352, price: 75.95 },
        { name: "Speedy Coyote", sales: 89, price: 190.00 },
        { name: "Furious Lizard", sales: 152, price: 25.00 },
        { name: "Indifferent Monkey", sales: 1, price: 99.95 },
        { name: "Brooding Dragon", sales: 0, price: 6350 },
        { name: "Ingenious Tadpole", sales: 39450, price: 0.35 },
        { name: "Optimistic Snail", sales: 420, price: 1.50 }
    ];

    var items = ko.observableArray(initialData);
    var gridViewModel = new SimpleGrid({
        data: items,
        columns: [
            { headerText: "Item Name", rowText: "name" },
            { headerText: "Sales Count", rowText: "sales" },
            { headerText: "Price", rowText: function (item) { return "$" + item.price.toFixed(2); } }
        ],
        pageSize: 4
    });

    return {
        items: items,
        addItem:function() {
            items.push({ name: "New item", sales: 0, price: 100 });
        },
        sortByName: function() {
            items.sort(function(a, b) {
                return a.name < b.name ? -1 : 1;
            });
        },
        jumpToFirstPage: function() {
            gridViewModel.currentPageIndex(0);
        },
        gridViewModel: gridViewModel,
        SimpleGrid: SimpleGrid
    };
});