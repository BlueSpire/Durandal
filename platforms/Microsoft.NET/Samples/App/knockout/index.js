define(['durandal/plugins/router'], function(router) {
    var childRouter = router.createChildRouter();

    childRouter.map([{
        type: 'intro',
        route: 'knockout-samples',
        moduleId: 'samples/knockout/helloWorld/index',
        title: 'Hello World'
    },
    {
        type: 'intro',
        route: 'knockout-samples/helloWorld',
        moduleId: 'samples/knockout/helloWorld/index',
        title: 'Hello World',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/clickCounter',
        moduleId: 'samples/knockout/clickCounter/index',
        title: 'Click Counter',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/simpleList',
        moduleId: 'samples/knockout/simpleList/index',
        title: 'Simple List',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/betterList',
        moduleId: 'samples/knockout/betterList/index',
        title: 'Better List',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/controlTypes',
        moduleId: 'samples/knockout/controlTypes/index',
        title: 'Control Types',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/collections',
        moduleId: 'samples/knockout/collections/index',
        title: 'Collection',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/pagedGrid',
        moduleId: 'samples/knockout/pagedGrid/index',
        title: 'Paged Grid',
        nav: true
    }, {
        type: 'intro',
        route: 'knockout-samples/animatedTrans',
        moduleId: 'samples/knockout/animatedTrans/index',
        title: 'Animated Transition',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/contactsEditor',
        moduleId: 'samples/knockout/contactsEditor/index',
        title: 'Contacts Editor',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/gridEditor',
        moduleId: 'samples/knockout/gridEditor/index',
        title: 'Grid Editor',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/shoppingCart',
        moduleId: 'samples/knockout/shoppingCart/index',
        title: 'Shopping Cart',
        nav: true
    }, {
        type: 'detailed',
        route: 'knockout-samples/twitterClient',
        moduleId: 'samples/knockout/twitterClient/index',
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