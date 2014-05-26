define(['plugins/router'], function(router){
    return {
        canActivate: function(){
            console.log('canActivate of ko/level3/sub3');
            console.log('is nav back: ' + router.navigatingBack);
            return true;
        },
        activate: function(){
            console.log('activate of ko/level3/sub3');
            console.log('is nav back: ' + router.navigatingBack);
        },
        canDeactivate: function(isClose){
            console.log('canDeactivate of ko/level3/sub3 ' + !!isClose);
            console.log('is nav back: ' + router.navigatingBack);
            return true;
        },
        deactivate: function(isClose){
            console.log('deactivate of ko/level3/sub3 ' + !!isClose);
            console.log('is nav back: ' + router.navigatingBack);
        }
    };
});
