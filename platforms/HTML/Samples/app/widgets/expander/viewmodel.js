﻿define('widgets/expander/viewmodel', ['plugins/widget','jquery'], function(widget, $) {
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
        var parts = widget.getParts(elements);
        var $itemContainer = $(parts.itemContainer);

        $itemContainer.hide();

        $(parts.headerContainer).bind('click', function() {
            $itemContainer.toggle('fast');
        });
    };

    return ctor;
});