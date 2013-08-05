/*global describe it */
var spawn = require('child_process').spawn;
var assert = require('assert');
var generators = require('..');


describe('Alias and namespaces', function () {
  it('env.namespace()', function () {
    var env = generators();
    assert.equal(env.namespace('backbone/all/index.js'), 'backbone:all');
    assert.equal(env.namespace('backbone/all/main.js'), 'backbone:all');
    assert.equal(env.namespace('backbone/all'), 'backbone:all');
    assert.equal(env.namespace('backbone/all.js'), 'backbone:all');
    assert.equal(env.namespace('backbone.js'), 'backbone');

    assert.equal(env.namespace('generator-backbone/all.js'), 'backbone:all');
    assert.equal(env.namespace('generator-mocha/backbone/model/index.js'), 'mocha:backbone:model');
    assert.equal(env.namespace('generator-mocha/backbone/model.js'), 'mocha:backbone:model');
    assert.equal(env.namespace('node_modules/generator-mocha/backbone/model.js'), 'mocha:backbone:model');

    assert.equal(env.namespace('../local/stuff'), 'local:stuff');
    assert.equal(env.namespace('./local/stuff'), 'local:stuff');
    assert.equal(env.namespace('././local/stuff'), 'local:stuff');
    assert.equal(env.namespace('../../local/stuff'), 'local:stuff');
  });

  it('should work with mixed similar lookups', function () {
    var env = generators();

    // Order is important, smaller lookup must come first here
    env.appendLookup('foo');
    env.appendLookup('foo/bar');

    assert.equal(env.namespace('foo/gen/all'), 'gen:all');
    assert.equal(env.namespace('foo/bar/gen/all'), 'gen:all');
  });

  it('should work with weird paths', function () {
    var env = generators();
    assert.equal(env.namespace('////gen/all'), 'gen:all');
    assert.equal(env.namespace('generator-backbone///all.js'), 'backbone:all');
    assert.equal(env.namespace('generator-backbone/././all.js'), 'backbone:all');
    assert.equal(env.namespace('generator-backbone/generator-backbone/all.js'), 'backbone:all');
  });

  it('should work in different OS', function () {
    var env = generators();
    assert.equal(env.namespace('backbone\\all\\main.js'), 'backbone:all');
    assert.equal(env.namespace('backbone\\all'), 'backbone:all');
    assert.equal(env.namespace('backbone\\all.js'), 'backbone:all');
  });
});
