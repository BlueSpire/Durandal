define(['durandal/system', 'durandal/app'], function(system, app) {

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
            app.showMessage('You could now send this to server: <br/>' + ko.utils.stringifyJson(self.gifts), 'Grid Editor - Results');
            // To actually transmit to server as a regular form post, write this: ko.utils.postJson($("form")[0], self.gifts);
        };
    };

    var vm = {
        GiftModel: new GiftModel([{ name: "Tall Hat", price: "39.95" }, { name: "Long Cloak", price: "120.00" }]),
        doSubmit: doSubmit,
        viewAttached: viewAttached
    }

    function doSubmit() {
        vm.GiftModel.save();
        // default form behavior in Knockout
        return false;
    }

    function viewAttached(view) {
        system.log('View Activating', this);

        // Activate jQuery Validation  - sorry not enabled for this demo
        //$("form").validate({ submitHandler: vm.GiftModel.save });
    }

    return vm;
});