define(['durandal/plugins/router'], function (router) {
    
    return {
        router: router,
        activate: function () {
            router.map([
                { url: 'hello', moduleId: 'samples/hello/index', name: 'Hello World', visible: true },
                { url: 'view-composition', moduleId: 'samples/viewComposition/index', name: 'View Composition', visible: true },
                { url: 'modal', moduleId: 'samples/modal/index', name: 'Modal Dialogs', visible: true },
                { url: 'event-aggregator', moduleId: 'samples/eventAggregator/index', name: 'Events', visible: true },
                { url: 'widgets', moduleId: 'samples/widgets/index', name: 'Widgets', visible: true },
                { url: 'master-detail', moduleId: 'samples/masterDetail/index', name: 'Master Detail', visible: true },
                { url: 'knockout-samples/:name', moduleId: 'samples/knockout/index', name: 'Knockout Samples' },
                { url: 'knockout-samples', moduleId: 'samples/knockout/index', name: 'Knockout Samples', visible: true }
            ]);
            
            return router.activate('hello');
        }
    };
});