/*global describe, before, it */
var fs = require('fs');
var events = require('events');
var assert = require('assert');
var proxyquire = require('proxyquire');
var conflicter = require('../lib/util/conflicter');


describe('conflicter', function () {
  beforeEach(conflicter.reset.bind(conflicter));

  conflicter.on('conflict', function () {
    process.nextTick(function () {
      process.stdin.write('Y\n');
      process.stdin.emit('data', 'Y\n');
    });
  });

  it('is an event emitter', function () {
    assert.ok(conflicter instanceof events.EventEmitter);
  });

  it('conflicter#colors', function () {
    assert.deepEqual(conflicter.colors, {
      'diff added': 42,
      'diff removed': 41
    });
  });

  it('conflicter#add(conflict)`', function () {
    conflicter.add(__filename);
    var conflict = conflicter.conflicts.pop();
    assert.deepEqual(conflict.file, __filename);
    assert.deepEqual(conflict.content, fs.readFileSync(__filename, 'utf8'));
  });

  describe('conflicter#resolve(cb)', function (done) {
    it('wihout conflict', function (done) {
      conflicter.resolve(done);
    });

    it('with at least one, without async callback handling', function (done) {
      var conflicts = 0;
      var callbackExecuted = false;

      conflicter.add(__filename);
      conflicter.add({
        file: 'foo.js',
        content: 'var foo = "foo";\n'
      });

      // called.
      conflicter.once('resolved:' + __filename, function (config) {
        conflicts++;
      });

      // not called.
      conflicter.once('resolved:foo.js', function (config) {
        conflicts++;
      });

      conflicter.resolve(function(){
        callbackExecuted = true;
      });

      assert(conflicts, 1);
      assert(!callbackExecuted);
      done();
    });

    it('with at least one, with async callback handling', function (done) {
      var called = 0;

      conflicter.add(__filename);
      conflicter.add({
        file: 'foo.js',
        content: 'var foo = "foo";\n'
      });

      conflicter.once('resolved:' + __filename, function (config) {
        called++;
        config.callback();
      });

      conflicter.once('resolved:foo.js', function (config) {
        called++;
        config.callback();
      });

      conflicter.resolve(function(){
        assert(called, 2);
        done();
      });
    });
  });


  describe.skip('conflicter#collision(filepath, content, cb)', function (done) {
    var me = fs.readFileSync(__filename, 'utf8');
    it('identical status', function(done) {
      conflicter.collision(__filename, me, function (status) {
        assert.equal(status, 'identical');
        done();
      });
    });

    it('create status', function (done) {
      conflicter.collision('foo.js', '', function (status) {
        assert.equal(status, 'create');
        done();
      });
    });

    it('conflict status', function (done) {
      conflicter.collision(__filename, '', function (status) {
        assert.equal(status, 'force');
        done();
      });
    });
  });

  it('conflicter#diff(actual, expected)', function () {
    var diff = conflicter.diff('var', 'let');
    assert.equal(diff, '\n\u001b[41mremoved\u001b[0m \u001b[42madded\u001b[0m\n\n\u001b[42mlet\u001b[0m\u001b[41mvar\u001b[0m\n');
  });

  describe('conflicter#_ask', function () {
    var promptMock = {
      prompt: function (config, cb) {
        cb({ overwrite: this.answer });
      },
      err: null,
      answer: null
    };

    before(function () {
      this.conflicter = proxyquire('../lib/util/conflicter', {
        '../actions/prompt': promptMock.prompt.bind(promptMock)
      });
    });

    it('Calls answer related function and pass a callback', function (done) {
      var callCount = 0;
      promptMock.answer = function (cb) { callCount++; cb(); };
      this.conflicter._ask('/tmp/file', 'my file contents', function (result) {
        assert(callCount, 1);
        done();
      });
    });
  });
});
