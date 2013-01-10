define(function (require) {
    var http = require('durandal/http'),
        app = require("durandal/app");
    
    var Flickr = function() {
        this.displayName = 'Flickr';
        this.images = ko.observableArray([]);
    };

    //The activator created in the shell calls 'activate' on any view model that it's set to.
    //You can optionally return a promise for async activation.
    //NOTE: All Durandal's async operations return promises and so do all jQuery's ajax functions, so
    //they can be easily composed together and used in async screen activation scenarios.
    Flickr.prototype.activate = function() {
        var that = this;
        return http.jsonp('http://api.flickr.com/services/feeds/photos_public.gne', { tags: 'mount ranier', tagmode: 'any', format: 'json' }, 'jsoncallback').then(function (response) {
            that.images(response.items);
        });
    };

    //the app model allows easy display of modal dialogs by passing a view model
    Flickr.prototype.select = function (item) {
        //views are usually located by convention, but you an specify it as well
        item.viewUrl = 'views/detail';
        app.showModal(item);
    };

    Flickr.prototype.canDeactivate = function () {
        return app.showMessage("Are you sure you want to leave this page?", 'Navigate', ["Yes", "No"]);
    };

    return Flickr;
});