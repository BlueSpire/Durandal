
var path    = require('path');
var helpers = require('../..').test;

describe('Quickstart generator test', function() {
  before(helpers.before(path.join(__dirname, './temp')));

  it('runs sucessfully', function(done) {
    helpers.runGenerator('quickstart', done);
  });

  it('creates expected files', function() {
   
    helpers.assertFile('.editorconfig');
  
    helpers.assertFile('.gitattributes');
  
    helpers.assertFile('.gitignore');
  
    helpers.assertFile('.jshintrc');
  
    helpers.assertFile('app/.htaccess');
  
    helpers.assertFile('app/404.html');
  
    helpers.assertFile('app/favicon.ico');
  
    helpers.assertFile('app/index.html');
  
    helpers.assertFile('app/robots.txt');
  
    helpers.assertFile('app/scripts/vendor/jquery.min.js');
  
    helpers.assertFile('app/scripts/vendor/modernizr.min.js');
  
    helpers.assertFile('app/styles/main.css');
  
    helpers.assertFile('Gruntfile.js');
  
    helpers.assertFile('package.json');
  
    helpers.assertFile('test/index.html');
  
    helpers.assertFile('test/lib/chai.js');
  
    helpers.assertFile('test/lib/expect.js');
  
    helpers.assertFile('test/lib/mocha/mocha.css');
  
    helpers.assertFile('test/lib/mocha/mocha.js');
  
    helpers.assertFile('test/runner/mocha.js');
  
    helpers.assertFile('test/spec/.gitkeep');
  
  });
});
