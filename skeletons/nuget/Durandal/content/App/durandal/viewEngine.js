define(function (require) {
    var system = require('./system');
    var parseMarkupCore;

    if ($.parseHTML) {
        parseMarkupCore = function(html) {
            return $.parseHTML(html);
        };
    } else {
        parseMarkupCore = function(html) {
            return $(html).get();
        };
    }

    return {
        viewExtension: '.html',
        viewPlugin: 'text',
        isViewUrl: function (url) {
            return url.indexOf(this.viewExtension, url.length - this.viewExtension.length) !== -1;
        },
        convertViewUrlToViewId: function (url) {
            return url.substring(0, url.length - this.viewExtension.length);
        },
        convertViewIdToRequirePath: function (viewId) {
            return this.viewPlugin + '!' + viewId + this.viewExtension;
        },
        parseMarkup: function (markup) {
            var allElements = parseMarkupCore(markup);
            if (allElements.length == 1) {
                return allElements[0];
            }

            var withoutComments = [];
            for (var i = 0; i < allElements.length; i++) {
                var current = allElements[i];
                if (current.nodeType != 8) {
                    withoutComments.push(current);
                }
            }

            if (withoutComments.length > 1) {
                return $(withoutComments).wrapAll('<div class="durandal-wrapper"></div').parent().get(0);
            }

            return withoutComments[0];
        },
        createView: function(viewId) {
            var that = this;
            var requirePath = this.convertViewIdToRequirePath(viewId);

            return system.defer(function(dfd) {
                system.acquire(requirePath).then(function(markup) {
                    var element = that.parseMarkup(markup);
                    element.setAttribute('data-view', viewId);
                    dfd.resolve(element);
                });
            }).promise();
        }
    };
});