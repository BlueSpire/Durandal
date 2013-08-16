requirejs.config({
    paths: {
        'text': '../../vendor/text',
        'durandal':'../../vendor/durandal/js',
        'plugins' : '../../vendor/durandal/js/plugins',
        'transitions' : '../../vendor/durandal/js/transitions'
    }
});

define('jquery', [], function(){ return jQuery; });
define('knockout', [], function(){ return ko; });

define(['durandal/system', 'durandal/app', 'durandal/composition'],  function (system, app, composition) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Durandal API';

    app.configurePlugins({
        router:true
    });

    app.start().then(function() {
        var markdown = new MarkdownDeep.Markdown();
        markdown.ExtraMode = true;
        markdown.SafeMode = false;

        ko.bindingHandlers.markdown = {
            init:function(element, valueAccessor){
                var value = valueAccessor(),
                    actual = ko.utils.unwrapObservable(value) || '';

                var output = markdown.Transform(actual);

                $(element).html(output);
            }
        };

        app.setRoot('shell');
    });
});