define(['toastr'], function(toastr){
    return {
        canActivate: function(){
            console.log('canActivate of ko/level3/sub2');
            return true;
        },
        activate: function(){
            console.log('activate of ko/level3/sub2');
        },
        canDeactivate: function(isClose){
            console.log('canDeactivate of ko/level3/sub2 ' + !!isClose);
            return true;
        },
        deactivate: function(isClose){
            console.log('deactivate of ko/level3/sub2 ' + !!isClose);
        }
    };
});
