define(["require", "exports", 'durandal/system'], function(require, exports, __system__) {
    var system = __system__;
    

    function test_system() {
        console.log(system.version);

        system.noop = function () {
        };

        var moduleId = system.getModuleId({});
        system.setModuleId({}, moduleId);

        var obj = system.resolveObject({});

        system.debug(true);
        var isDebugging = system.debug();

        system.log(1, '2', { prop: 3 });

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
});
