define(['durandal/system'], function(system) {
    var entrance = function (parent, newChild, settings) {
        return system.defer(function(dfd) {
            if (!newChild) {
                ko.virtualElements.emptyNode(parent);
                dfd.resolve();
            } else {
                var $previousView = $(ko.virtualElements.firstChild(parent));
                var duration = settings.duration || 500;
                var $view = $(newChild);

                ko.virtualElements.setDomNodeChildren(parent, [newChild]);

                if ($previousView.length) {
                    $previousView.fadeOut(100, beginEntranceTransition);
                } else {
                    dfd.resolve();
                }

                // Internal animation helpers
                function beginEntranceTransition() {
                    system.log('Running the entrance transition');

                    $view.css({
                        marginLeft: '20px',
                        marginRight: '-20px',
                        opacity: 0
                    });

                    entranceThemeTransition();
                }

                function entranceThemeTransition() {
                    var css = {
                        display: 'block',
                        visibility: 'visible'
                    };

                    var properties = {
                        marginRight: 0,
                        marginLeft: 0,
                        opacity: 1
                    };

                    var easing = 'swing';

                    $view.css(css)
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