define(function (require) {
    var system = require('../system');

    function firstChildElement(parent) {
        var child = ko.virtualElements.firstChild(parent);
        while (child && child.nodeType != 1) {
            child = ko.virtualElements.nextSibling(child);
        }
        return child;
    }

    var entrance = function (parent, newChild, settings) {
        return system.defer(function (dfd) {
            if (!newChild) {
                ko.virtualElements.emptyNode(parent);
                dfd.resolve();
            } else {
                var $previousView = $(firstChildElement(parent));
                var duration = settings.duration || 500;

                if ($previousView.length) {
                    $previousView.fadeOut(100, beginEntranceTransition);
                } else {
                    beginEntranceTransition();
                }

                function beginEntranceTransition() {

                    if (!settings.keepScrollPosition) {
                        // scroll to the top
                        $(document).scrollTop(0);
                    }

                    ko.virtualElements.setDomNodeChildren(parent, [newChild]);

                    $(newChild).css({
                        marginLeft: '20px',
                        marginRight: '-20px',
                        opacity: 0
                    });

                    entranceThemeTransition();
                }

                function entranceThemeTransition() {
                    var properties = {
                        marginRight: 0,
                        marginLeft: 0,
                        opacity: 1
                    };

                    var easing = 'swing';

                    $(newChild)
                        .animate(properties, duration, easing, completeAnimation);
                }

                function completeAnimation() {
                    dfd.resolve();
                }
            }
        }).promise();
    };

    return entrance;
});