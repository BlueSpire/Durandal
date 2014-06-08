define(['durandal/system', 'knockout'], function(system, ko) {
    var thirdVm = ko.observable();

    var vm = {
        activate:activate,
        title:'Third Tab',
        deactivate:deactivate,
        thirdVm:thirdVm,
    };

    return vm;

    function activate(id) {
        system.log('Third Tab Activated', null, 'details', true);
        return loadObservables(id);
    }

    function deactivate() {
        system.log('Third Tab Deactivated', null, 'details', true);
    }

    function loadObservables(id) {
        thirdVm({ id:id, name:'Third Tab Content' });
    }
});