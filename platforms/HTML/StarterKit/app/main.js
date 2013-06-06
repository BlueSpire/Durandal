requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions'
    }
});

define(['../lib/durandal/js/durandal'], function(){
    require(['bootstrapper']);
});