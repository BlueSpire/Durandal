define(['durandal/system', 'knockout'], function(system, ko) {
    var firstVm = ko.observable();

    var vm = {
        activate:activate,
        title:'First Tab',
        deactivate:deactivate,
        firstVm:firstVm,
    };

    return vm;

    function activate(id) {
        system.log('First Tab Activated');
        return loadObservables(id);
    }

    function deactivate() {
        system.log('First Tab Deactivated');
    }

    function loadObservables(id) {
        firstVm({ id:id, name:'First Tab Content' });
    }
});