
var path    = require('path');
var helpers = require('../..').test;

describe('Ember generator test', function() {
  before(helpers.before(path.join(__dirname, './temp')));

  it('runs sucessfully', function(done) {
    helpers.runGenerator('ember', done);
  });

  it('creates expected files', function() {
   
    helpers.assertFile('app/scripts/models');
  
    helpers.assertFile('app/scripts/controllers');
  
    helpers.assertFile('app/scripts/views');
  
    helpers.assertFile('app/scripts/routes');
  
    helpers.assertFile('app/scripts/helpers');
  
    helpers.assertFile('app/scripts/templates');
  
    helpers.assertFile('app/scripts/main.js');
  
    helpers.assertFile('app/scripts/routes/app-router.js');
  
    helpers.assertFile('app/scripts/store.js');
  
    helpers.assertFile('.gitattributes');
  
    helpers.assertFile('.gitignore');
  
    helpers.assertFile('app/.htaccess');
  
    helpers.assertFile('app/404.html');
  
    helpers.assertFile('app/favicon.ico');
  
    helpers.assertFile('app/index.html');
  
    helpers.assertFile('app/robots.txt');
  
    helpers.assertFile('app/scripts/vendor/ember-1.0.pre.min.js');
  
    helpers.assertFile('app/scripts/vendor/handlebars-1.0.0.beta.6.js');
  
    helpers.assertFile('app/scripts/vendor/jquery.min.js');
  
    helpers.assertFile('app/styles/main.css');
  
    helpers.assertFile('Gruntfile.js');
  
    helpers.assertFile('package.json');
  
    helpers.assertFile('test/index.html');
  
    helpers.assertFile('test/lib/chai.js');
  
    helpers.assertFile('test/lib/expect.js');
  
    helpers.assertFile('test/lib/mocha-1.2.2/mocha.css');
  
    helpers.assertFile('test/lib/mocha-1.2.2/mocha.js');
  
    helpers.assertFile('test/runner/mocha.js');
  
    helpers.assertFile('app/scripts/views/application-view.js');
  
    helpers.assertFile('app/scripts/templates/application.handlebars');
  
    helpers.assertFile('app/scripts/models/application-model.js');
  
    helpers.assertFile('app/scripts/controllers/application-controller.js');
  
  });
});
