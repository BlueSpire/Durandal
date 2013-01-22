define(function(require) {
    var system = require('./system');
    var parseHtmlCore;

    if ($.parseHTML) {
        parseHtmlCore = function(html) {
            return $.parseHTML(html);
        };
    } else {
        parseHtmlCore = function(html) {
            return $(html).get();
        };
    }

    return {
        ready: function() {
            return system.defer(function(dfd) {
                $(function() {
                    dfd.resolve();
                });
            }).promise();
        },
        getElementById: function(id) {
            return document.getElementById(id);
        },
        createElement: function(tagName) {
            return document.createElement(tagName);
        },
        parseHTML: function(html, doNotWrapMultiple) {
            var allElements = parseHtmlCore(html);
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
                if (doNotWrapMultiple) {
                    return withoutComments;
                }

                return $(withoutComments).wrapAll('<div class="durandal-wrapper"></div').parent().get(0);
            }

            return withoutComments[0];
        }
    };
});