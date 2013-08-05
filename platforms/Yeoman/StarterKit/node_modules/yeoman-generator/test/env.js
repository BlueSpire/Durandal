/*global it, describe, before */
var fs = require('fs');
var path = require('path');
var util = require('util');
var assert = require('assert');
var generators = require('..');
var helpers = generators.test;
var events = require('events');

var Base = generators.Base;
var Environment = require('../lib/env');

// https://gist.github.com/87550fd10b7440a37df4
describe('Environment', function () {
  before(generators.test.before(path.join(__dirname, 'temp')));

  describe('Environment', function () {
    it('to init the system, you need to create a new handler', function () {
      var env = generators();
      assert.ok(env instanceof Environment);
      assert.ok(env instanceof events.EventEmitter);
    });

    it('adds new filepath to the loadpahts using appendLookup / prependLookup', function () {
      var env = generators();
      assert.ok(env.lookups.length);

      assert.ok(env.lookups.slice(-1)[0], 'lib/generators');

      env.appendLookup('support/scaffold');
      assert.ok(env.lookups.slice(-1)[0], 'support/scaffold');
    });

    // generators is an instance of event emitter.
    it('generators() is an instance of EventEmitter', function () {
      assert.ok(generators() instanceof events.EventEmitter, 'Not an instance of EventEmitter');
    });

    it('generators.Base is the Base generator class', function () {
      assert.equal(generators.Base.prototype.__proto__.constructor, events.EventEmitter, 'Not an EventEmitter');
    });

    it('generators.NamedBase is inheriting from Base generator class', function () {
      assert.equal(generators.NamedBase.prototype.__proto__.constructor, generators.Base, 'Not a Base class');
    });

    it('init the system using your own args / options', function () {
      // using a list of space-separated arguments as String
      var env = generators('model Post', { help: true });
      assert.deepEqual(env.arguments, ['model', 'Post']);
      assert.deepEqual(env.options, {
        help: true
      });

      // using a list of arguments as Array
      env = generators(['model', 'Post']);
      assert.deepEqual(env.arguments, ['model', 'Post']);
      assert.deepEqual(env.options, {});
    });

    it('registers generators using the .register() method', function () {
      var env = generators();
      assert.equal(Object.keys(env.generators).length, 0);

      env
        .register('../fixtures/custom-generator-simple', 'fixtures:custom-generator-simple')
        .register('../fixtures/custom-generator-extend', 'scaffold');

      assert.equal(Object.keys(env.generators).length, 2);

      var simple = env.generators['fixtures:custom-generator-simple'];
      assert.ok(simple);
      assert.ok(typeof simple === 'function');
      assert.ok(simple.namespace, 'fixtures:custom-generator-simple');

      var extend = env.generators.scaffold;
      assert.ok(extend);
      assert.ok(typeof extend === 'function');
      assert.ok(extend.namespace, 'scaffold');
    });

    it('get the list of namespaces', function () {
      var namespaces = generators()
        .register('../fixtures/custom-generator-simple')
        .register('../fixtures/custom-generator-extend')
        .register('../fixtures/custom-generator-extend', 'support:scaffold')
        .namespaces();

      assert.deepEqual(namespaces, ['simple', 'extend:support:scaffold', 'support:scaffold']);
    });

    it('output the general help', function () {
      var env = generators()
        .register('../fixtures/custom-generator-simple')
        .register('../fixtures/custom-generator-extend');

      var expected = fs.readFileSync(path.join(__dirname, 'fixtures/help.txt'), 'utf8');
      // lazy "update the help fixtures because something changed" statement
      // fs.writeFileSync(path.join(__dirname, 'fixtures/help.txt'), env.help().trim());
      assert.equal(env.help().trim(), expected.trim());

      // custom bin name
      assert.equal(env.help('gg').trim(), expected.replace('Usage: init', 'Usage: gg').trim());
    });

    it('get() can be used to get a specific generator', function () {
      var env = generators()
        .register('../fixtures/mocha-generator', 'fixtures:mocha-generator')
        .register('../fixtures/mocha-generator', 'mocha:generator');

      var expected = require('./fixtures/mocha-generator');
      assert.equal(env.get('mocha:generator'), expected);
      assert.equal(env.get('fixtures:mocha-generator'), expected);
    });

    it('create() can be used to get and instantiate a specific generator', function () {
      var env = generators().register('../fixtures/mocha-generator', 'mocha:generator');

      var mocha = env.create('mocha:generator');
      assert.deepEqual(mocha.arguments, []);

      mocha = env.create('mocha:generator', {
        arguments: ['another', 'set', 'of', 'arguments'],
        options: {
          'assertion-framework': 'chai'
        }
      });

      assert.deepEqual(mocha.arguments, ['another', 'set', 'of', 'arguments']);
      assert.equal(mocha.options['assertion-framework'], 'chai');
    });

    it('invokes using the run() method, from generators handler', function (done) {
      var env = generators()
        .register('../fixtures/mocha-generator-base', 'fixtures:mocha-generator-base')
        .run(['fixtures:mocha-generator-base', 'foo', 'bar'], done);
    });

    it('invokes using the run() method, from specific generator', function (done) {
      var env = generators().register('../fixtures/mocha-generator', 'fixtures:mocha-generator');
      var mocha = env.create('fixtures:mocha-generator');
      mocha.run(done);
    });
  });

  describe('Engines', function () {

    before (function () {
      this.generator = new Base([], {
        env: generators(),
        resolved: __filename
      });
    });

    it('allows users to use their prefered engine', function () {
      // engine should be able to take a fn, or a named engine (which we
      // provide adapters to, currently only underscore is supported)
      generators().engine('underscore');
    });

    it('throws on wrong engine', function (done) {
      try {
        generators().engine('underscored');
      } catch (e) {
        done();
      }
    });

    it('properly compiles and renders template',  function (done) {
      var filename = 'boyah.js';

      this.generator.template(path.join(__dirname, 'fixtures/template.jst'), filename, { foo: 'hey' });
      this.generator.conflicter.resolve(function (err) {
        if (err) {
          return done(err);
        }

        assert.equal(fs.readFileSync(filename, 'utf8'), "var hey = 'hey';" + '\n');
        done();
      });
    });

    it('lets you use %% and escape opening tags with underscore engine', function () {
      var tpl = 'prefix/<%%= yeoman.app %>/foo/bar';
      assert.equal(this.generator.engine(tpl), 'prefix/<%= yeoman.app %>/foo/bar');
      assert.equal(this.generator.engine('<%% if(true) { %>'), '<% if(true) { %>');
    });

  });

  // Events
  // ------

  // A series of events are emitted during the generation process. Both on
  // the global `generators` handler and each individual generators
  // involved in the process.
  describe('Events', function () {
    before(function () {
      var Generator = this.Generator = function () {
        generators.Base.apply(this, arguments);
      };

      Generator.namespace = 'angular:all';

      util.inherits(Generator, generators.Base);

      Generator.prototype.createSomething = function () {};
      Generator.prototype.createSomethingElse = function () {};
    });

    it('emits the series of event on a specific generator', function (done) {
      var angular = new this.Generator([], {
        env: generators(),
        resolved: __filename
      });

      var lifecycle = ['start', 'createSomething', 'createSomethingElse', 'end'];

      function assertEvent(e) {
        return function() {
          assert.equal(e, lifecycle.shift());
          if (e === 'end') {
            done();
          }
        };
      }

      angular
        // Start event, emitted right before "running" the generator.
        .on('start', assertEvent('start'))
        // End event, emitted after the generation process, when every generator method and hooks are executed
        .on('end', assertEvent('end'))
        // Emitted when a conflict is detected, right after the prompt happens.
        // .on('conflict', assertEvent('conflict'))
        // Emitted on every prompt, both for conflict state and generators one.
        // .on('prompt', assertEvent('prompt'))
        // Emitted right before a hook is invoked
        // .on('hook', assertEvent('hook'))
        // Emitted on each generator method
        .on('createSomething', assertEvent('createSomething'))
        .on('createSomethingElse', assertEvent('createSomethingElse'));

      angular.run();
    });

    it('hoists up the series of event from specific generator to the generators handler', function (done) {
      var lifecycle = [
        'generators:start',
        'angular:all:start',
        'angular:all:createSomething',
        'angular:all:createSomethingElse',
        'angular:all:end',
        'generators:end'
      ];

      function assertEvent(ev) {
        return function () {
          assert.equal(ev, lifecycle.shift());
          if (!lifecycle.length) {
            done();
          }
        };
      }

      generators()
        .register(this.Generator)
        // Series of events proxied from the resolved generator
        .on('generators:start', assertEvent('generators:start'))
        .on('generators:end', assertEvent('generators:end'))
        // .on('conflict', assertEvent('generators:conflict'))
        // .on('prompt', assertEvent('generators:prompt'))
        // .on('hook', assertEvent('generators:start'))

        // Emitted for each generator method invoked, prefix by the generator namespace
        .on('angular:all:createSomething', assertEvent('angular:all:createSomething'))
        .on('angular:all:createSomethingElse', assertEvent('angular:all:createSomethingElse'))

        // Additionally, for more specific events, same prefixing happens on
        // start, end, conflict, prompt and hook.
        .on('angular:all:start', assertEvent('angular:all:start'))
        .on('angular:all:end', assertEvent('angular:all:end'))
        .on('angular:all:conflict', assertEvent('angular:all:conflict'))
        .on('angular:all:prompt', assertEvent('angular:all:prompt'))

        // actual run
        .run('angular:all myapp');
    });
  });

  // Underscore String

  // > http://epeli.github.com/underscore.string/
  // > https://github.com/epeli/underscore.string#string-functions
  //
  // Underscore String set of utilities are very handy, especially in the
  // context of Generators. We often want to humanize, dasherize or underscore
  // a given variable.
  //
  // Since templates are invoked in the context of the Generator that render
  // them, all these String helpers are then available directly from templates.
  describe('Underscore String', function () {
    before(function () {
      this.dummy = new generators.Base([], {
        env: generators(),
        resolved: __filename
      });
    });

    it('has the whole Underscore String API available as prorotype mehtod', function () {
      var str = require('underscore.string').exports();

      Object.keys(str).forEach(function (prop) {
        if (typeof str[prop] !== 'function') {
          return;
        }
        assert.equal(typeof this.dummy._[prop], 'function');
      }, this);
    });
  });
});
