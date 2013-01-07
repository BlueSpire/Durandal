define(function(require) {
    var system = require('./system');
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
        parseHTML: function(html) {
            return $(html).get(0);
        }
    };
});