
var path    = require('path');
var helpers = require('../..').test;

describe('Bbb generator test', function() {
  before(helpers.before(path.join(__dirname, './temp')));

  it('runs sucessfully', function(done) {
    helpers.runGenerator('bbb', done);
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
  
    helpers.assertFile('app/scripts/app.js');
  
    helpers.assertFile('app/scripts/config.js');
  
    helpers.assertFile('app/scripts/libs/almond.js');
  
    helpers.assertFile('app/scripts/libs/backbone.js');
  
    helpers.assertFile('app/scripts/libs/jquery.js');
  
    helpers.assertFile('app/scripts/libs/lodash.js');
  
    helpers.assertFile('app/scripts/libs/require.js');
  
    helpers.assertFile('app/scripts/main.js');
  
    helpers.assertFile('app/scripts/plugins/backbone.layoutmanager.js');
  
    helpers.assertFile('app/scripts/router.js');
  
    helpers.assertFile('app/styles/h5bp.css');
  
    helpers.assertFile('app/styles/index.css');
  
    helpers.assertFile('Gruntfile.js');
  
    helpers.assertFile('package.json');
  
    helpers.assertFile('test/index.html');
  
    helpers.assertFile('test/lib/chai.js');
  
    helpers.assertFile('test/lib/expect.js');
  
    helpers.assertFile('test/lib/mocha/mocha.css');
  
    helpers.assertFile('test/lib/mocha/mocha.js');
  
    helpers.assertFile('test/runner/mocha.js');
  
    helpers.assertFile('test/spec/example.js');
  
  });
});
