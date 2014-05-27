define(['plugins/router', 'knockout'], function(router, ko){
    return {
        activate: function(){
            this.badTry(false);
        },
        username: ko.observable(''),
        password: ko.observable(''),
        badTry: ko.observable(false),
        submit: function(){
            if(this.username()=='admin' && this.password()=='admin') {
                router.permissions(['admin']);
                router.navigate();
            }
            else {
                this.badTry(true);
            }
        }
    };
});
