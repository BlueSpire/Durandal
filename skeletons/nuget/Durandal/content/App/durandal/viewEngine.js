define(function(require) {
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

    function parseHTML(html) {
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
            return $(withoutComments).wrapAll('<div class="durandal-wrapper"></div').parent().get(0);
        }

        return withoutComments[0];
    }

    return {
        viewExtension: '.html',
        pluginPath: 'text',
        createView: function(name, markup) {
            var element = parseHTML(markup);
            element.setAttribute('data-view', name);
            return element;
        }
    };
});