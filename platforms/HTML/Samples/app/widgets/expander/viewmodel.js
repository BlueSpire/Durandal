define(['durandal/composition','jquery'], function(composition, $) {
    var ctor = function() { };

    ctor.prototype.activate = function(settings) {
        this.settings = settings;
    };

    ctor.prototype.getHeaderText = function(item) {
        if (this.settings.headerProperty) {
            return item[this.settings.headerProperty];
        }

        return item.toString();
    };

    ctor.prototype.afterRenderItem = function(elements, item) {
        var parts = composition.getParts(elements);
        var $itemContainer = $(parts.itemContainer);

        $itemContainer.hide();

        $(parts.headerContainer).bind('click', function() {
            $itemContainer.toggle('fast');
        });
    };

    return ctor;
});