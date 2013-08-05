/*global describe, before, it */
var fs = require('fs');
var path = require('path');
var util = require('util');
var events = require('events');
var assert = require('assert');
var generators = require('..');


describe('yeoman.generators.Base', function () {
  // increase timeout to 15s for this suite (slow connections like mine
  // needs that)
  this.timeout(50000);

  before(generators.test.before(path.join(__dirname, 'temp')));

  before(function () {
    function Dummy() {
      generators.Base.apply(this, arguments);
    }

    util.inherits(Dummy, generators.Base);

    Dummy.prototype.test = function () {
      this.shouldRun = true;
    };

    this.env = generators();
    this.dummy = new Dummy({
      env: this.env,
      resolved: 'test:fetch'
    });
    this.Dummy = Dummy;

    this.homedir = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
  });

  it('generator.bowerInstall(name)', function (done) {
    this.dummy.bowerInstall('backbone', function (err) {
      fs.stat('components/backbone', done);
    });
  });

  describe('generator.tarball(tarball, destination, cb)', function () {
    it('should allow the fecthing / untar of a given tarball, at the given location', function (done) {
      this.dummy.tarball('https://github.com/yeoman/yeoman.io/tarball/gh-pages', './yeoman.io/', function (err) {
        if (err) {
          return done(err);
        }
        fs.stat('./yeoman.io/index.html', done);
      });
    });
  });

  describe('generator.fetch(url, destination, cb)', function () {
    it('should allow the fething of a single file', function (done) {
      this.dummy.fetch('https://raw.github.com/yeoman/generators/master/README.md', './some/path/README.md', function (err) {
        if (err) {
          return done(err);
        }
        fs.stat('./some/path/README.md', done);
      });
    });
  });

  describe('generator.remote(user, repo, branch, cb)', function () {
    it('should remotely fetch a package on github', function (done) {
      this.dummy.remote('yeoman', 'generators', done);
    });

    it('should have the result cached internally into a `_cache` folder', function (done) {
      fs.stat(path.join(this.homedir, '.yeoman/cache/yeoman/generators/master'), done);
    });

    it('should invoke `cb` with a remote object to interract with the downloaded package', function (done) {
      this.dummy.remote('yeoman', 'generators', function (err, remote) {
        if (err) {
          return done(err);
        }

        ['copy', 'template', 'directory'].forEach(function (method) {
          assert.equal(typeof remote[method], 'function');
        });

        done();
      });
    });
  });
});
