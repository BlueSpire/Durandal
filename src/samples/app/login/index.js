define(['plugins/router', 'knockout'], function(router, ko){
    return {
        canReuseForRoute: function(){
            return router.permissions.indexOf('admin') == -1;
        },
        activate: function(){
            this.badTry(false);
        },
        username: ko.observable(''),
        password: ko.observable(''),
        badTry: ko.observable(false),
        submit: function(){
            if(this.username()=='admin' && this.password()=='admin') {
                router.permissions(['admin']);
                router.loadUrl({trigger: true, replace: false});
            }
            else {
                this.badTry(true);
            }
        }
    };
});
