define(['plugins/router'], function (router) {
    function unauthorized() {
        return !router.hasPermission('admin');
    }

    return {
        router: router,
        activate: function () {
            console.log('activate of shell ');
            return router.map([
                { route: ['', 'home'],                          moduleId: 'hello/index',                title: 'Hello World',           nav: 1 },
                { route: '*rest',   authorize: unauthorized,    moduleId: 'login/index',                title: 'Login Page',            nav: false},
                { route: 'view-composition',                    moduleId: 'viewComposition/index',      title: 'View Composition',      nav: true },
                { route: 'modal',                               moduleId: 'modal/index',                title: 'Modal Dialogs',         nav: 3 },
                { route: 'event-aggregator',                    moduleId: 'eventAggregator/index',      title: 'Events',                nav: 2 },
                { route: 'widgets',                             moduleId: 'widgets/index',              title: 'Widgets',               nav: true },
                { route: 'master-detail',                       moduleId: 'masterDetail/index',         title: 'Master Detail',         nav: true },
                { route: 'knockout-samples*details',            moduleId: 'ko/index',                   title: 'Knockout Samples',      nav: true },
                { route: 'keyed-master-details/:id*details',    moduleId: 'keyedMasterDetail/master',   title: 'Keyed Master Detail',   hash: '#keyed-master-details/:id' }
            ]).buildNavigationModel()
              .mapUnknownRoutes('hello/index', 'not-found')
              .activate();
        }
    };
});
