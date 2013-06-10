requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});

define(['../Scripts/durandal/durandal'], function () {
    require(['bootstrapper']);
});