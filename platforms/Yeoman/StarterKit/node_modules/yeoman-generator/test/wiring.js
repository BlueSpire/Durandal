/*global describe, before, it */
var path = require('path');
var fs = require('fs');
var events = require('events');
var assert = require('assert');
var wiring = require('../lib/actions/wiring');

describe('yeoman.generator.lib.actions.wiring', function () {
  before(function () {
    this.fixtures = path.join(__dirname, 'fixtures');
  });

  it('should generate a simple block', function () {
    var res = wiring.generateBlock('js', 'main.js', [
      'path/file1.js',
      'path/file2.js'
    ]);

    assert.equal(res.trim(), '<!-- build:js main.js -->\npath/file1.js,path/file2.js        <!-- endbuild -->');
  });

  it('should generate a simple block with search path', function () {
    var res = wiring.generateBlock('js', 'main.js', [
      'path/file1.js',
      'path/file2.js'
    ], '.tmp/');

    assert.equal(res.trim(), '<!-- build:js(.tmp/) main.js -->\npath/file1.js,path/file2.js        <!-- endbuild -->');
  });

  it('should generate block with multiple search paths', function () {
    var res = wiring.generateBlock('js', 'main.js', [
      'path/file1.js',
      'path/file2.js'
    ], ['.tmp/', 'dist/']);

    assert.equal(res.trim(), '<!-- build:js({.tmp/,dist/}) main.js -->\npath/file1.js,path/file2.js        <!-- endbuild -->');
  });

  it('should append js files to an html string', function () {
    var html = '<html><body></body></html>';
    var res = wiring.appendFiles(html, 'js', 'out/file.js', ['in/file1.js', 'in/file2.js']);
    var fixture = fs.readFileSync(path.join(this.fixtures, 'js_block.html'),
                                  'utf-8').trim();

    assert.equal(res, fixture);
  });

  it('appendFiles should work the same using the object syntax', function () {
    var html = '<html><body></body></html>';
    var res = wiring.appendFiles(html, 'js', 'out/file.js', ['in/file1.js', 'in/file2.js']);
    var res2 = wiring.appendFiles({
      html: html,
      fileType: 'js',
      optimizedPath: 'out/file.js',
      sourceFileList: ['in/file1.js', 'in/file2.js']
    });

    assert.equal(res, res2);
  });
});
