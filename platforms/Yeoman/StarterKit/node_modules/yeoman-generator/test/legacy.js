/*global describe before it */
var spawn = require('child_process').spawn;
var assert = require('assert');
var generators = require('..');

// Helpers

// Install an npm package
function install() {
  var pkgs = Array.prototype.slice.call(arguments);

  if (!pkgs.length) {
    throw new Error('Missing package');
  }

  return function (done) {
    console.error('... Install pkgs ...', pkgs.join(' '));
    var npm = spawn('npm', ['install'].concat(pkgs));
    npm.stdout.pipe(process.stdout);
    npm.stderr.pipe(process.stdout);
    npm.on('exit', function (code) {
      done(code ? new Error('Error installing ' + pkgs.join(' ') + ' (code: ' + code + ')') : null);
    });
    return npm;
  };
}

function expects(lookup, ln) {
  return function() {
    var env = generators();
    env.prefix('yeoman-');
    assert.equal(env.namespaces().length, 0);
    env.lookup(lookup);
    assert.equal(env.namespaces().length, ln);
  };
}

describe.skip('Legacy support', function () {
  // disable timeout
  this.timeout(0);

  // on github
  before(install('mklabs/yeoman-jekyll'));
  before(install('mklabs/generators#generator-backbone'));

  // on npm
  // before(install('yeoman-coffeebone', 'yeoman-startr', 'yeoman-wordpress', 'yeoman-bootstrap-less'));

  it('lookup *:*', expects('*:*', 9));
  it('lookup generator-backbone:*', expects('generator-backbone:*', 6));
  it('lookup generator-backbone:all', expects('generator-backbone:all', 1));
  it('lookup yeoman-jekyll:*', expects('yeoman-jekyll:*', 3));
  it('lookup generator-backbone:*', expects('generator-backbone:*', 6));

  it('lookup yeoman-jekyll:*', function () {
    var env = generators();
    env.prefix('yeoman-*');
    env.prefix('generator-*');
    env.lookup('*:*');
    assert.deepEqual(env.namespaces(), [
      'backbone:all',
      'backbone:app',
      'backbone:collection',
      'backbone:model',
      'backbone:router',
      'backbone:view',
      'jekyll:gruntfile',
      'jekyll',
      'jekyll:post'
    ]);
  });
});
