define(['durandal/plugins/router'], function (router) {
    
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', moduleId: 'samples/hello/index', title: 'Hello World', nav: true },
                { route: 'view-composition', moduleId: 'samples/viewComposition/index', title: 'View Composition', nav: true },
                { route: 'modal', moduleId: 'samples/modal/index', title: 'Modal Dialogs', nav: true },
                { route: 'event-aggregator', moduleId: 'samples/eventAggregator/index', title: 'Events', nav: true },
                { route: 'widgets', moduleId: 'samples/widgets/index', title: 'Widgets', nav: true },
                { route: 'master-detail', moduleId: 'samples/masterDetail/index', title: 'Master Detail', nav: true },
                { route: 'knockout-samples/:name', moduleId: 'samples/knockout/index', title: 'Knockout Samples' },
                { route: 'knockout-samples', moduleId: 'samples/knockout/index', title: 'Knockout Samples', nav: true }
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});