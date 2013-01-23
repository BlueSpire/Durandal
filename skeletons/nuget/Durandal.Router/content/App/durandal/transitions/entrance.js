define(function(require) {
    var system = require('../system');
    var fadeOutDuration = 100;

    var entrance = function(parent, newChild, settings) {
        return system.defer(function(dfd) {
            function endTransition() {
                dfd.resolve();
            }

            if (!settings.keepScrollPosition) {
                $(document).scrollTop(0);
            }

            if (!newChild) {
                if (settings.activeView) {
                    $(settings.activeView).fadeOut(fadeOutDuration, function () {
                        if (!settings.cacheViews) {
                            ko.virtualElements.emptyNode(parent);
                        }
                        endTransition();
                    });
                } else {
                    if (!settings.cacheViews) {
                        ko.virtualElements.emptyNode(parent);
                    }
                    endTransition();
                }
            } else {
                var $previousView = $(settings.activeView);
                var duration = settings.duration || 500;

                function startTransition() {
                    if (settings.cacheViews) {
                        if (settings.composingNewView) {
                            ko.virtualElements.prepend(parent, newChild);
                        }
                    } else {
                        ko.virtualElements.emptyNode(parent);
                        ko.virtualElements.prepend(parent, newChild);
                    }

                    var startValues = {
                        marginLeft: '20px',
                        marginRight: '-20px',
                        opacity: 0,
                        display: 'block'
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
                    $previousView.fadeOut(fadeOutDuration, startTransition);
                } else {
                    startTransition();
                }
            }
        }).promise();
    };

    return entrance;
});