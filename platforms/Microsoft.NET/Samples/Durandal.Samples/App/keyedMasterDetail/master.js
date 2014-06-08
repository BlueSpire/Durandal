define(['plugins/router', 'knockout', 'durandal/system'], function(router, ko, system) {
    var masterVm = ko.observable();

    var childRouter = router
        .createChildRouter()
        .makeRelative({ moduleId:'keyedMasterDetail', fromParent:true, dynamicHash:':id' })
        .map([
            { route: ['first', ''], moduleId: 'first',  title: 'First', nav: true, hash: '#first' },
            { route:'second',       moduleId:'second',  title:'Second', nav:true },
            { route:'third',        moduleId:'third',   title:'Third',  nav:true }
        ]).buildNavigationModel();

    var vm = {
        router:childRouter,
        activate:activate,
        deactivate:deactivate,
        masterVm:masterVm
    };

    return vm;

    function activate(id) {
        system.log('Master View ' + id + ' Activated');
        return loadObservables(id);
    }

    function deactivate() {
        system.log('Master View ' + masterVm().id + ' Deactivated');
    }

    function loadObservables(id) {
        masterVm({ id:id, name:'Master' });
    }
});