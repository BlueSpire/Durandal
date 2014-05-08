define(['durandal/system', 'durandal/app', 'jquery', 'knockout'], function(system, app, $, ko) {
    var GiftModel = function (gifts) {
        var self = this;
        self.gifts = ko.observableArray(gifts);

        self.addGift = function () {
            self.gifts.push({
                name: "",
                price: ""
            });
        };

        self.removeGift = function (gift) {
            self.gifts.remove(gift);
        };

        self.save = function (form) {
            //alert("Could now transmit to server: ");
            app.showMessage('You could now send this to server: ' + ko.utils.stringifyJson(self.gifts), 'Grid Editor - Results');
            // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
        };

        self.activate = function () {
            console.log('activate grid');
        };

        self.canActivate = function () {
            console.log('canActivate grid');
            return true;
        };

        self.canDeactivate = function () {
            return app.showMessage('Are you sure you want to leave?', 'Leaving', ['Yes', 'No']);
        };

        self.deactivate = function () {
            console.log('deactivate grid');
        };
    };

    return new GiftModel([{ name: "Tall Hat", price: "39.95" }, { name: "Long Cloak", price: "120.00" }]);
});