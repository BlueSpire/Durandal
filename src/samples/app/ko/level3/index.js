define(['plugins/router', 'durandal/system'], function (router, system) {
    return {
        getRouter: function () {
            var self = this;
            if (self.myRouter) return self.myRouter;

            // here i'm gonna show that router can be returned by promise, developer may need to fill routes dynamically
            return system.defer(function (dfd) {
                setTimeout(function () {

                    self.myRouter = router.createChildRouter()
                        .makeRelative({
                            moduleId: 'ko/level3',
                            fromParent: true
                        }).map([
                            { route: ['', 'sub1'], moduleId: 'sub1/index', title: 'Sub page 1', nav: true },
                            { route: 'sub2', moduleId: 'sub2/index', title: 'Sub page 2', nav: true, authorize: ['user'] },
                            { route: 'sub3', moduleId: 'sub3/index', title: 'Sub page 3', nav: true, authorize: ['admin'] }
                        ]).buildNavigationModel();

                    dfd.resolve(self.myRouter);
                }, 500);
            });
        },
        canReuseForRoute: function(){
            // by returning this object, we explicitly tell parent router to not call activation life-cycle hooks
            // when user is navigating between sub-pages of our router.
            return { reactivate: false };
        },
        viewUrl: 'ko/level3/index',
        canActivate: function () {
            console.log('canActivate of ko/level3');
            return true;
        },
        activate: function () {
            console.log('activate of ko/level3 ');
        },
        canDeactivate: function (isClose) {
            console.log('canDeactivate of ko/level3 ' + !!isClose);
            return true;
        },
        deactivate: function (isClose) {
            console.log('deactivate of ko/level3 ' + !!isClose);
        }
    };
});
