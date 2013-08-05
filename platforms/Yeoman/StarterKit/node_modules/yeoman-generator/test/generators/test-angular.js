/*global describe before it */
var path = require('path');
var helpers = require('../..').test;
var generators = require('../..');


describe('Angular generator test', function () {
  // cleanup the temp dir and cd into it
  before(helpers.before(path.join(__dirname, './temp')));

  before(function (done) {
    // setup the environment
    this.env = generators().lookup('*:*');
    this.env.run('angular:all foo bar', done);
  });

  it('creates expected files', function () {
    helpers.assertFile('app/.htaccess');
    helpers.assertFile('app/404.html');
    helpers.assertFile('app/favicon.ico');
    helpers.assertFile('app/robots.txt');
    helpers.assertFile('app/scripts/vendor/angular.js');
    helpers.assertFile('app/scripts/vendor/angular.min.js');
    helpers.assertFile('app/styles/main.css');
    helpers.assertFile('app/views/main.html');
    helpers.assertFile('Gruntfile.js');
    helpers.assertFile('package.json');
    helpers.assertFile('test/vendor/angular-mocks.js');
    helpers.assertFile('app/scripts/app.js');
    helpers.assertFile('app/index.html');
    helpers.assertFile('app/scripts/controllers/main.js');
    helpers.assertFile('test/spec/controllers/main.js');
    helpers.assertFile('testacular.conf.js');
  });
});
