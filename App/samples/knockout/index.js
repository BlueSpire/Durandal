define(function () {
    var system = require('durandal/system'),
        viewModel = require('durandal/viewModel');
    
    return {
        activeSample:viewModel.activator(),
        introSamples: [{
            name: 'Hello World',
            hash: '#/knockout-samples/helloWorld',
            moduleId: 'samples/knockout/helloWorld/index'
        },{
            name: 'Click Counter',
            hash: '#/knockout-samples/clickCounter',
            moduleId: 'samples/knockout/clickCounter/index'
        },{
            name: 'Simple List',
            hash: '#/knockout-samples/simpleList',
            moduleId: 'samples/knockout/simpleList/index'
        },{
            name: 'Better List',
            hash: '#/knockout-samples/betterList',
            moduleId: 'samples/knockout/betterList/index'
        },{
            name: 'Control Types',
            hash: '#/knockout-samples/controlTypes',
            moduleId: 'samples/knockout/controlTypes/index'
        },{
            name: 'Collection',
            hash: '#/knockout-samples/collections',
            moduleId: 'samples/knockout/collections/index'
        },{
            name: 'Paged Grid',
            hash: '#/knockout-samples/pagedGrid',
            moduleId: 'samples/knockout/pagedGrid/index'
        },{
            name: 'Animated Transition',
            hash: '#/knockout-samples/animatedTrans',
            moduleId: 'samples/knockout/animatedTrans/index'
        }],
        detailedSamples: [{
            name: 'Contacts Editor',
            hash: '#/knockout-samples/contactsEditor',
            moduleId: 'samples/knockout/contactsEditor/index'
        },{
            name: 'Grid Editor',
            hash: '#/knockout-samples/gridEditor',
            moduleId: 'samples/knockout/gridEditor/index'
        },{
            name: 'Shopping Cart',
            hash: '#/knockout-samples/shoppingCart',
            moduleId: 'samples/knockout/shoppingCart/index'
        },{
            name: 'Twitter Client',
            hash: '#/knockout-samples/twitterClient',
            moduleId: 'samples/knockout/twitterClient/index'
        }],
        activate: function (args) {
            var that = this;

            if (!args.name) {
                args.name = 'helloWorld';
            }

            return system.acquire('samples/knockout/' + args.name + '/index').then(function(sample) {
                that.activeSample(sample);
            });
        }
    };
});