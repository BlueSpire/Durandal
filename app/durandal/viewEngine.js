define(['text', 'durandal/dom'], function() {
    var dom = require('durandal/dom');

    return {
        viewExtension:'.html',
        pluginPath:'text',
        createView:function(name, markup) {
            var element = dom.parseHTML(markup);
            element.setAttribute('data-view', name);
            return element;
        }
    };
});