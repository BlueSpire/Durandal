/*global describe, before, beforeEach, after, afterEach, it */
var fs = require('fs');
var path = require('path');
var util = require('util');
var events = require('events');
var assert = require('assert');
var generators = require('..');
var helpers = require('../lib/test/helpers');


describe('yeoman.generators.Base', function () {
  // TODO(mklabs): generate generator about to be tested, or add it in fixtures.

  before(generators.test.before(path.join(__dirname, 'temp.dev')));

  before(function () {
    var env = this.env = generators();

    function Dummy() {
      generators.Base.apply(this, arguments);
    }

    util.inherits(Dummy, generators.Base);

    Dummy.prototype.test = function () {
      this.shouldRun = true;
    };

    env.register(Dummy, 'ember:all');
    env.register(Dummy, 'hook1:ember');
    env.register(Dummy, 'hook2:ember:all');
    env.register(Dummy, 'hook3');
    env.register(function () {
      this.write('app/scripts/models/application-model.js', '// ...');
    }, 'hook4');

    this.Dummy = Dummy;
    this.dummy = new Dummy(['bar', 'baz', 'bom'], {
      foo: false,
      something: 'else',
      // mandatory options, created by the env#create() helper
      resolved: 'ember:all',
      env: env,
    });

    this.dummy
      .hookFor('hook1')
      .hookFor('hook2')
      .hookFor('hook3')
      .hookFor('hook4');
  });

  describe('generator.appname', function () {
    it('should be set with the project directory name without non-alphanums', function () {
      assert.equal(this.dummy.appname, "temp dev");
    });
  });

  describe('generator.run(args, cb)', function () {
    it('should run all methods in the given generator', function () {
      this.dummy.run();
    });

    it('should have the _running flag turned on', function () {
      assert.ok(this.dummy._running);
    });
  });

  describe('generator.run(args, cb) regression', function () {
    var events = [];
    var resolveCalled = 0;
    var resolveExpected = 0;

    before(function () {
      var Unicorn = function () {
        generators.Base.apply(this, arguments);
      };

      util.inherits(Unicorn, generators.Base);

      Unicorn.prototype.test1 = function () {
        this.async()();
      };

      Unicorn.prototype.test2 = function () {
        // Nothing
      };

      Unicorn.prototype.test3 = function () {
        this.async()('mostlyn\'t');
      };

      Unicorn.prototype.test4 = function () {
        // Nothing again
      };

      this.unicorn = helpers.createGenerator('unicorn:app', [
        [Unicorn, 'unicorn:app']
      ]);

      helpers.stub(this.unicorn, 'emit', function (type, err) {
        events.push({
          type: type,
          err: err
        });

        if (type === 'method') {
          resolveExpected++;
        }
      });

      helpers.decorate(this.unicorn.conflicter, 'resolve', function () {
        resolveCalled++;
      });
    });

    after(helpers.restore);

    afterEach(function () {
      events = [];
      resolveCalled = 0;
      resolveExpected = 0;
    });

    it('should call `done` only once', function (done) {
      // Mocha will fail if done was called more than once.
      this.unicorn.run({}, done);
    });

    it('should emit an error from async', function (done) {
      this.unicorn.run({}, function () {
        assert.ok(JSON.stringify(events).indexOf('{"type":"error","err":"mostlyn\'t"}') > -1);
        done();
      });
    });

    it('should resolve conflicts after each method is invoked', function (done) {
      this.unicorn.run({}, function () {
        assert.equal(resolveCalled, resolveExpected);
        done();
      });
    });
  });

  describe('generator.runHooks(cb)', function () {
    it('should go through all registered hooks, and invoke them in series', function (done) {
      this.dummy.runHooks(function (err) {
        if (err) {
          return err;
        }
        fs.stat('app/scripts/models/application-model.js', done);
      });
    });
  });

  describe('generator.argument(name, config)', function () {
    it('should add a new argument to the generator instance', function () {
      assert.equal(this.dummy._arguments.length, 0);
      this.dummy.argument('foo');
      assert.equal(this.dummy._arguments.length, 1);
    });

    it('should create the property specified with value from positional args', function () {
      assert.equal(this.dummy.foo, 'bar');
    });

    it('should slice positional arguments when config.type is Array', function () {
      this.dummy.argument('bar', {
        type: Array
      });

      assert.deepEqual(this.dummy.bar, ['baz', 'bom']);
    });

    it('should raise an error if required arguments are not provided', function (done) {
      var dummy = new generators.Base([], {
        env: this.env,
        resolved: 'dummy:all'
      }).on('error', function (ev) {
        done();
      });

      dummy.argument('foo', {
        required: true
      });
    });
  });

  describe('generator.option(name, config)', function () {
    it('should add a new option to the set of generator expected options', function () {
      // every generator have the --help options
      var generator = new this.Dummy([], {
        env: this.env,
        resolved: 'test'
      });

      assert.equal(generator._options.length, 1);
      generator.option('foo');
      assert.equal(generator._options.length, 2);
      assert.deepEqual(generator._options.pop(), {
        desc: 'Description for foo',
        name: 'foo',
        type: Boolean,
        defaults: false,
        hide: false
      });
    });
  });

  describe('generator.hookFor(name, config)', function () {
    it('should emit errors if called when running', function () {
      try {
        this.dummy.hookFor('maoow');
      } catch (err) {
        assert.equal(err.message, 'hookFor must be used within the constructor only');
      }
    });

    it('should create the macthing option', function () {
      this.dummy._running = false;
      this.dummy.hookFor('something');
      assert.deepEqual(this.dummy._options.pop(), {
        desc: 'Something to be invoked',
        name: 'something',
        type: Boolean,
        defaults: 'else',
        hide: false
      });
    });

    it('should update the internal hooks holder', function () {
      assert.deepEqual(this.dummy._hooks.pop(), {
        name: 'something'
      });
    });
  });

  describe('generator.defaultFor(config)', function () {
    it('should return the value for the option name, doing lookup in options and Grunt config', function () {
      var name = this.dummy.defaultFor('something');
      assert.equal(name, 'else');
    });
  });

  describe('generator.desc(decription)', function () {
    it('should update the internal description', function () {
      this.dummy.desc('A new desc for this generator');
      assert.equal(this.dummy.description, 'A new desc for this generator');
    });
  });

  describe('generator.help()', function () {
    it('should return the expected help / usage output', function () {
      this.dummy.option('ooOoo');
      var help = this.dummy.help();

      assert.ok(help.match('Usage:'));
      assert.ok(help.match('yeoman init FOO one two three \\[options\\]'));
      assert.ok(help.match('A new desc for this generator'));
      assert.ok(help.match('Options:'));
      assert.ok(help.match('--help   # Print generator\'s options and usage'));
      assert.ok(help.match('--ooOoo  # Description for ooOoo'));
    });
  });

  describe('generator.usage()', function () {
    it('should return the expected help / usage output', function () {
      var usage = this.dummy.usage();
      assert.equal(usage, 'yeoman init FOO one two three [options]\n\nA new desc for this generator');
    });
  });
});
