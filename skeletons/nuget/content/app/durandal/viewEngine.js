define(function(require) {
    var dom = require('./dom'),
        text = require('text');

    return {
        viewExtension: '.html',
        pluginPath: 'text',
        createView: function(name, markup) {
            var element = dom.parseHTML(markup);
            element.setAttribute('data-view', name);
            return element;
        }
    };
});