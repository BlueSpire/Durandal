define(['durandal/system', 'knockout'], function(system, ko) {
    var secondVm = ko.observable();

    var vm = {
        activate:activate,
        title:'Second Tab',
        deactivate:deactivate,
        secondVm:secondVm,
    };

    return vm;

    function activate(id) {
        system.log('Second Tab Activated', null, 'details', true);
        return loadObservables(id);
    }

    function deactivate() {
        system.log('Second Tab Deactivated', null, 'details', true);
    }

    function loadObservables(id) {
        secondVm({ id:id, name:'Second Tab Content' });
    }
});