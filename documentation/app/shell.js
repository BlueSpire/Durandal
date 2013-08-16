define(function (require) {
    var router = require('plugins/router'),
        apiModel = require('apiModel'),
        ko = require('knockout'),
        app = require('durandal/app');

    function addIsActive(model){
        model.isActive = ko.computed(function(){
            var i = router.activeInstruction();
            return i && ko.utils.arrayIndexOf(i.params, model.title) != -1;
        });

        return model;
    }

    var core = ['activator','app', 'binder','composition','events', 'system', 'viewEngine', 'viewLocator'];

    return {
        router: router,
        coreNav:[],
        pluginNav:[],
        activate: function () {
            for(var name in apiModel.modules){
                var nav = addIsActive({ route:'module/' + name, hash:'#module/' + name, title: name });

                if(ko.utils.arrayIndexOf(core, name) == -1){
                    this.pluginNav.push(nav);
                }else{
                    this.coreNav.push(nav);
                }
            }

            router.updateDocumentTitle = function(instance, instruction){
                if (instruction.config.title == 'Home') {
                    document.title = "Home | " + app.title;
                } else if (app.title) {
                    var name = instruction.params[1];

                    if(instruction.params[2]){
                        name += '.' + instruction.params[2];
                    }

                    document.title = name + " | " + app.title;
                }
            };

            return router.map([
                { route: '', title:'Home', moduleId: 'home' },
                { route: ':containerType/:containerName', moduleId: 'container' },
                { route: ':containerType/:containerName/property/:itemName', moduleId: 'property' },
                { route: ':containerType/:containerName/method/:itemName', moduleId: 'method' },
                { route: ':containerType/:containerName/event/:itemName', moduleId: 'event' },
                { route: ':containerType/:containerName/class/:itemName', moduleId: 'container' }
            ]).activate();
        }
    };
});