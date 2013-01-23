define(function(require) {
    var system = require('../system');

    var entrance = function(parent, newChild, settings) {
        return system.defer(function(dfd) {
            function endTransition() {
                dfd.resolve();
            }

            if (!settings.keepScrollPosition) {
                $(document).scrollTop(0);
            }

            if (!newChild) {
                ko.virtualElements.emptyNode(parent);
                endTransition();
            } else {
                var $previousView = $(ko.virtualElements.firstChildElement(parent));
                var duration = settings.duration || 500;

                function startTransition() {
                    ko.virtualElements.setDomNodeChildren(parent, [newChild]);
                    if ($previousView) {
                        $previousView.style.display = 'block';
                    }

                    var startValues = {
                        marginLeft: '20px',
                        marginRight: '-20px',
                        opacity: 0
                    };

                    var endValues = {
                        marginRight: 0,
                        marginLeft: 0,
                        opacity: 1
                    };

                    $(newChild).css(startValues);
                    $(newChild).animate(endValues, duration, 'swing', endTransition);
                }

                if ($previousView.length) {
                    $previousView.fadeOut(100, startTransition);
                } else {
                    startTransition();
                }
            }
        }).promise();
    };

    return entrance;
});