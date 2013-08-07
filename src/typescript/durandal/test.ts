/// <reference path="../jquery/jquery.d.ts" />
/// <reference path="../knockout/knockout.d.ts" />
/// <reference path="durandal.d.ts"/>

import system = require('durandal/system');
import viewEngine = require('durandal/viewEngine');
import Events = require('durandal/events');
import binder = require('durandal/binder');
import activator = require('durandal/activator');
import viewLocator = require('durandal/viewLocator');
import composition = require('durandal/composition');
import app = require('durandal/app');
import dialog = require('plugins/dialog');
import history = require('plugins/history');
import http = require('plugins/http');
import observable = require('plugins/observable');
import serializer = require('plugins/serializer');
import widget = require('plugins/widget');
import router = require('plugins/router');

function test_system() {
    system.log(system.version);

    system.noop = () => { };

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

    system.defer<number>(dfd => {
        dfd.resolve(42);
    }).promise().then(value => {
            system.log(value);
        });

    var uuid = system.guid();

    system.acquire('some/module').then(someModule => {
        var s = someModule;
        s.log('acquired');
    });

    system.acquire(['one', 'two']).then(modules => {
        system.log(modules);
    });

    system.acquire('one', 'two').then(modules => {
        system.log(modules);
    });

    var extended = system.extend({ test: 'thing' }, { what: 'there' });
    system.log(extended);

    system.wait(500).then(() => {
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
    
    ev.on('test:event').then(arg => {
        console.log(arg);
    });

    ev.trigger('test:event', { prop: 'value' });

    Events.includeIn({});
}

function test_activator() {
    var content = activator.create();

    content.activateItem({}).then(result => {
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

    app.start().then(() => {
        app.setRoot('test');
    });
}

function test_router(){
    router.activate().then(() => {
        router.createChildRouter();
        router.handlers[0].routePattern;
        router.install();
    });
}