/*global describe, before, it */
var path = require('path');
var assert = require('assert');
var generators = require('..');
var helpers = generators.test;


describe('generators config', function () {
  describe('when config("generators.test-framework") is set', function () {
    before(function () {
      this.env = generators().register(function () {}, 'ember:model');
    });

    it('I get the appropriate generator.options', function () {
      var generator = this.env.create('ember:model', {
        args: ['hey'],
        options: {
          generator: {
            'test-framework': 'jasmine'
          }
        }
      });

      assert.equal(generator.options['test-framework'], 'jasmine');

      generator = new generators.Base({
        env: this.env,
        resolved: 'test',
        generator: {
          'test-framework': 'mocha'
        }
      });

      assert.equal(generator.options['test-framework'], 'mocha');
    });
  });
});
