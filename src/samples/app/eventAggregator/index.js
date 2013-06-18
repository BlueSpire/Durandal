define('eventAggregator/index', ['eventAggregator/publisher', 'eventAggregator/subscriber'], function (publisher, subscriber) {
    return {
        publisher:publisher,
        subscriber: subscriber
    };
});