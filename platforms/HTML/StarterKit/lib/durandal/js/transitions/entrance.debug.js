define('transitions/entrance', ['durandal/system'],
function(system) {

    var fadeOutDuration = 100;
    var endValues = {
        marginRight: 0,
        marginLeft: 0,
        opacity: 1
    };
    var clearValues = {
        marginLeft: '',
        marginRight: '',
        opacity: '',
        display: ''
    };

    var entrance = function(context) {
        return system.defer(function(dfd) {
            function endTransition() {
                dfd.resolve();
            }

            function scrollIfNeeded() {
                if (!context.keepScrollPosition) {
                    $(document).scrollTop(0);
                }
            }

            if (!context.child) {
                scrollIfNeeded();

                if (context.activeView) {
                    $(context.activeView).fadeOut(fadeOutDuration, function () {
                        if (!context.cacheViews) {
                            ko.virtualElements.emptyNode(context.parent);
                        }
                        endTransition();
                    });
                } else {
                    if (!context.cacheViews) {
                        ko.virtualElements.emptyNode(context.parent);
                    }
                    endTransition();
                }
            } else {
                var $previousView = $(context.activeView);
                var duration = context.duration || 500;
                var fadeOnly = !!context.fadeOnly;

                function startTransition() {
                    scrollIfNeeded();

                    if (context.cacheViews) {
                        if (context.composingNewView) {
                            ko.virtualElements.prepend(context.parent, context.child);
                        }
                    } else {
                        ko.virtualElements.emptyNode(context.parent);
                        ko.virtualElements.prepend(context.parent, context.child);
                    }

                    context.triggerViewAttached();

                    var startValues = {
                        marginLeft: fadeOnly ? '0' : '20px',
                        marginRight: fadeOnly ? '0' : '-20px',
                        opacity: 0,
                        display: 'block'
                    };

                    var $child = $(context.child);

                    $child.css(startValues);
                    $child.animate(endValues, duration, 'swing', function () {
                        $child.css(clearValues);
                        endTransition();
                    });
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
