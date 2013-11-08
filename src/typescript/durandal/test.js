/// <reference path="../jquery/jquery.d.ts" />
/// <reference path="../knockout/knockout.d.ts" />
/// <reference path="durandal.d.ts"/>
define(["require", "exports", 'durandal/system', 'durandal/events', 'durandal/activator', 'durandal/app', 'plugins/observable', 'plugins/router'], function(require, exports, __system__, __Events__, __activator__, __app__, __observable__, __router__) {
    var system = __system__;
    
    var Events = __Events__;
    
    var activator = __activator__;
    
    
    var app = __app__;
    
    
    
    var observable = __observable__;
    
    
    var router = __router__;

    function test_system() {
        system.log(system.version);

        system.noop = function () {
        };

        var moduleId = system.getModuleId({});
        system.setModuleId({}, moduleId);

        var obj = system.resolveObject({});

        system.debug(true);
        var isDebugging = system.debug();

        system.log(1, '2', { prop: 3 });
        system.log(system.version);

        system.error('Error');
        system.error(new Error('This is an error message.'));

        system.assert(2 + 2 == 4, 'Uh oh. The universe got broked...');

        system.defer(function (dfd) {
            dfd.resolve(42);
        }).promise().then(function (value) {
            system.log(value);
        });

        var uuid = system.guid();

        system.acquire('some/module').then(function (someModule) {
            var s = someModule;
            s.log('acquired');
        });

        system.acquire(['one', 'two']).then(function (modules) {
            system.log(modules);
        });

        system.acquire('one', 'two').then(function (modules) {
            system.log(modules);
        });

        var extended = system.extend({ test: 'thing' }, { what: 'there' });
        system.log(extended);

        system.wait(500).then(function () {
            system.log('Test');
        });

        var check = system.isArray(extended);
        check = system.isArguments(extended);
        check = system.isBoolean(extended);
        check = system.isDate(extended);
        check = system.isElement(extended);
        check = system.isFunction(extended);
        check = system.isNumber(extended);
        check = system.isObject(extended);
        check = system.isPromise(extended);
        check = system.isString(extended);
    }

    function test_Events() {
        var ev = new Events();

        ev.on('test:event').then(function (arg) {
            console.log(arg);
        });

        ev.trigger('test:event', { prop: 'value' });

        Events.includeIn({});
    }

    function test_activator() {
        var content = activator.create();

        content.activateItem({}).then(function (result) {
            console.log(result);
        });
    }

    function test_app() {
        app.configurePlugins({
            widgets: true,
            dialog: true,
            router: true
        });

        app.title = 'Test App';

        app.start().then(function () {
            app.setRoot('test');
        });
    }

    function test_router() {
        var currentActiveRoute = router.activeInstruction().config.route;

        var vm = {
            router: router
        };

        vm.router.on('test', function (x) {
        }).map(null).activate();

        router.activate().then(function () {
            router.createChildRouter();
            router.handlers[0].routePattern;
            router.install();
        });
    }

    function test_observable() {
        var o = observable(null, "test");

        o.subscribe(function (x) {
            console.log(x);
        });

        observable.convertObject({});
    }
});
