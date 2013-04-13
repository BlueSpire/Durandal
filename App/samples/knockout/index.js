define(function () {
    var system = require('durandal/system'),
        viewModel = require('durandal/viewModel');
    
    return {
        activeSample:viewModel.activator(),
        samples: [
            {
                name: 'Paged Grid',
                hash: '#/knockout-samples/pagedGrid',
                moduleId: 'samples/knockout/pagedGrid/index'
            }
        ],
        activate: function (args) {
            var that = this;

            if (!args.name) {
                args.name = 'pagedGrid';
            }

            return system.acquire('samples/knockout/' + args.name + '/index').then(function(sample) {
                that.activeSample(sample);
            });
        }
    };
});