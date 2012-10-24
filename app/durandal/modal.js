define(function(require) {
    var system = require("durandal/system"),
        viewModelBinder = require("durandal/viewModelBinder");

    var zIndex = 1000, getNextZIndex = function() {
        return ++zIndex;
    };

    var ModalWindow = function(settings) {
        this.settings = settings || {};
    };

    ModalWindow.prototype.open = function() {
        var that = this, body = $('body'), viewElement = this.settings.view;

        this.dfd = system.defer();
        this.$view = $(viewElement);
        this.$fadeLayer = $('<div class="fade"></div>');

        if(this.settings.viewModel) {
            viewModelBinder.bind(this.settings.viewModel, viewElement);
            this.settings.viewModel.window = this;
        }

        var docWidth = $(document).width(),
            docHeight = $(document).height();

        this.$fadeLayer
            .css({
                'z-index':getNextZIndex(),
                'width':docWidth,
                'height':docHeight
            })
            .appendTo(body);

        var scrollTop = $(window).scrollTop();
        this.$view
            .addClass("popup")
            .addClass("fadable")
            .appendTo(body);

        this.$view
            .css({
                'top': ((($(window).height() / 2) - (this.$view.height() / 2)) + scrollTop) + 'px',
                'left': (($(document).width() / 2) - (this.$view.width() / 2)) + 'px',
                'z-index': getNextZIndex(),
                'opacity':1
        });

        if (this.settings.viewModel && this.settings.viewModel.viewAttached) {
            this.settings.viewModel.viewAttached(this.settings.view);
        }

        return this.dfd.promise();
    };

    ModalWindow.prototype.close = function(dialogResult) {
        var that = this;
        this.$fadeLayer.css({ 'opacity': 0 });
        this.$view.css({ 'opacity': 0 });

        setTimeout(function() {
            that.$fadeLayer.remove();
            delete that.$fadeLayer;

            that.$view.remove();
            delete that.$view;

            that.dfd.resolve(dialogResult);
        }, 300);
    };

    return ModalWindow;
});