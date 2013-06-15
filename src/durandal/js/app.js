define(['durandal/system', 'durandal/viewEngine', 'durandal/composition', 'durandal/events', 'jquery'], function(system, viewEngine, composition, Events, $) {
    var app;

    function loadPlugins(){
        return system.defer(function(dfd){
            var config = app.plugins || {},
                pluginIds = system.keys(config),
                pluginConfigs = [],
                i;

            if(pluginIds.length == 0){
                dfd.resolve();
                return;
            }

            for(i = 0; i < pluginIds.length; i++){
                var key = pluginIds[i];
                pluginIds[i] = 'plugins/' + key
                pluginConfigs[i] = config[key];
            }

            system.acquire.apply(system, pluginIds).then(function(){
                var results = [];

                for(i = 0; i < arguments.length; i++){
                    var currentModule = arguments[i];

                    if(currentModule.install){
                        var config = pluginConfigs[i];
                        if(!system.isObject(config)){
                            config = {};
                        }

                        var result = currentModule.install(config);
                        results.push(result);
                        delete currentModule.install;
                        system.log('Plugin:Installed ' + pluginIds[i].replace('plugins/', ''));
                    }else{
                        system.log('Plugin:Loaded ' + pluginIds[i].replace('plugins/', ''));
                    }
                }

                $.when(results).then(dfd.resolve);
            });
        }).promise();
    }

    app = {
        title: 'Application',
        plugins:{},
        start: function() {
            system.log('Application:Starting');

            if (this.title) {
                document.title = this.title;
            }

            return system.defer(function (dfd) {
                $(function() {
                    loadPlugins().then(function(){
                        dfd.resolve();
                        system.log('Application:Started');
                    });
                });
            }).promise();
        },
        setRoot: function(root, transition, applicationHost) {
            var hostElement, settings = { activate:true, transition: transition };

            if (!applicationHost || system.isString(applicationHost)) {
                hostElement = document.getElementById(applicationHost || 'applicationHost');
            } else {
                hostElement = applicationHost;
            }

            if (system.isString(root)) {
                if (viewEngine.isViewUrl(root)) {
                    settings.view = root;
                } else {
                    settings.model = root;
                }
            } else {
                settings.model = root;
            }

            composition.compose(hostElement, settings);
        }
    };

    Events.includeIn(app);

    return app;
});