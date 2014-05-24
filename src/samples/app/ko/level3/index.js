define(['plugins/router'], function(router){
    var childRouter = router.createChildRouter()
        .makeRelative({
            moduleId:'ko/level3',
            fromParent:true
        }).map([
            { route: ['', 'sub1'],  moduleId: 'sub1/index', title: 'Sub page 1', nav: true },
            { route: 'sub2',        moduleId: 'sub2/index', title: 'Sub page 2', nav: true }
        ]).buildNavigationModel();

    return {
        router: childRouter,
        viewUrl: 'ko/level3/index',
        canActivate: function(){
            console.log('canActivate of ko/level3');
            return true;
        },
        activate: function(){
            console.log('activate of ko/level3 ');
        },
        canDeactivate: function(isClose){
            console.log('canDeactivate of ko/level3 ' + !!isClose);
            return true;
        },
        deactivate: function(isClose){
            console.log('deactivate of ko/level3 ' + !!isClose);
        }
    };
});
