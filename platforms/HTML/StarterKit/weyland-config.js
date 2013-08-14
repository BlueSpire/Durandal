exports.config = function(weyland) {
    weyland.build('main')
        .task.jshint({
            include:'app/**/*.js'
        })
        .task.uglifyjs({
            include:['app/**/*.js', 'lib/durandal/**/*.js']
        })
        .task.rjs({
            include:['app/**/*.{js,html}', 'lib/durandal/**/*.js'],
            loaderPluginExtensionMaps:{
                '.html':'text'
            },
            rjs:{
                name:'../lib/require/almond-custom', //to deploy with require.js, use the build's name here instead
                insertRequire:['main'], //not needed for require
                baseUrl : 'app',
                wrap:true, //not needed for require
                paths : {
                    'text': '../lib/require/text',
                    'durandal':'../lib/durandal/js',
                    'plugins' : '../lib/durandal/js/plugins',
                    'transitions' : '../lib/durandal/js/transitions',
                    'knockout': '../lib/knockout/knockout-2.3.0',
                    'bootstrap': '../lib/bootstrap/js/bootstrap',
                    'jquery': '../lib/jquery/jquery-1.9.1'
                },
                inlineText: true,
                optimize : 'none',
                pragmas: {
                    build: true
                },
                stubModules : ['text'],
                keepBuildDir: true,
                out:'app/main-built.js'
            }
        });
}