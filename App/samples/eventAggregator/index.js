define(function (require) {
    var publisher = require('samples/eventAggregator/publisher'),
        subscriber = require('samples/eventAggregator/subscriber');

    return {
        publisher:publisher,
        subscriber: subscriber
    };
});