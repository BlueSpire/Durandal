define(['durandal/app'], function(app) {

    var SimpleGrid = function (configuration) {
        this.data = configuration.data;
        this.currentPageIndex = ko.observable(0);
        this.pageSize = configuration.pageSize || 5;

        // If you don't specify columns configuration, we'll use scaffolding
        this.columns = configuration.columns || getColumnsForScaffolding(ko.utils.unwrapObservable(this.data));

        this.itemsOnCurrentPage = ko.computed(function() {
            var startIndex = this.pageSize * this.currentPageIndex();
            return this.data.slice(startIndex, startIndex + this.pageSize);
        }, this);

        this.maxPageIndex = ko.computed(function() {
            return Math.ceil(ko.utils.unwrapObservable(this.data).length / this.pageSize) - 1;
        }, this);
    };

    SimpleGrid.prototype.getColumnsForScaffolding = function(data) {
        if ((typeof data.length !== 'number') || data.length === 0) {
            return [];
        }
        var columns = [];
        for (var propertyName in data[0]) {
            columns.push({ headerText: propertyName, rowText: propertyName });
        }
        return columns;
    };

    return SimpleGrid;
});