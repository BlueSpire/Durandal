define(['plugins/router'], function(router) {
    var childRouter = router.createChildRouter();

    childRouter.map([{
        type: 'intro',
        route: 'knockout-samples',
        moduleId: 'knockout/helloWorld/index',
        title: 'Hello World'
    },
    {
        type: 'intro',
        route: 'knockout-samples/helloWorld',
        moduleId: 'knockout/helloWorld/index',
        title: 'Hello World',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/clickCounter',
        moduleId: 'knockout/clickCounter/index',
        title: 'Click Counter',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/simpleList',
        moduleId: 'knockout/simpleList/index',
        title: 'Simple List',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/betterList',
        moduleId: 'knockout/betterList/index',
        title: 'Better List',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/controlTypes',
        moduleId: 'knockout/controlTypes/index',
        title: 'Control Types',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/collections',
        moduleId: 'knockout/collections/index',
        title: 'Collection',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/pagedGrid',
        moduleId: 'knockout/pagedGrid/index',
        title: 'Paged Grid',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/animatedTrans',
        moduleId: 'knockout/animatedTrans/index',
        title: 'Animated Transition',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/contactsEditor',
        moduleId: 'knockout/contactsEditor/index',
        title: 'Contacts Editor',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/gridEditor',
        moduleId: 'knockout/gridEditor/index',
        title: 'Grid Editor',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/shoppingCart',
        moduleId: 'knockout/shoppingCart/index',
        title: 'Shopping Cart',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/twitterClient',
        moduleId: 'knockout/twitterClient/index',
        title: 'Twitter Client',
        nav: true
    }])
    .buildNavigationModel();

    return {
        router: childRouter,
        introSamples: ko.computed(function() {
            return ko.utils.arrayFilter(childRouter.navigationModel(), function(route) {
                return route.type == 'intro';
            });
        }),
        detailedSamples: ko.computed(function() {
            return ko.utils.arrayFilter(childRouter.navigationModel(), function(route) {
                return route.type == 'detailed';
            });
        })
    };
});