
var path    = require('path');
var helpers = require('../..').test;

describe('Backbone generator test', function() {
  before(helpers.before(path.join(__dirname, './temp')));

  it('runs sucessfully', function(done) {
    helpers.runGenerator('backbone', done);
  });

  it('creates expected files', function() {
   
    helpers.assertFile('app/scripts/models');
  
    helpers.assertFile('app/scripts/collections');
  
    helpers.assertFile('app/scripts/views');
  
    helpers.assertFile('app/scripts/routes');
  
    helpers.assertFile('app/scripts/helpers');
  
    helpers.assertFile('app/scripts/templates');
  
    helpers.assertFile('app/scripts/main.js');
  
    helpers.assertFile('.gitattributes');
  
    helpers.assertFile('.gitignore');
  
    helpers.assertFile('app/.htaccess');
  
    helpers.assertFile('app/404.html');
  
    helpers.assertFile('app/favicon.ico');
  
    helpers.assertFile('app/index.html');
  
    helpers.assertFile('app/robots.txt');
  
    helpers.assertFile('app/scripts/vendor/backbone-min.js');
  
    helpers.assertFile('app/scripts/vendor/jquery.min.js');
  
    helpers.assertFile('app/scripts/vendor/lodash.min.js');
  
    helpers.assertFile('app/styles/main.css');
  
    helpers.assertFile('Gruntfile.js');
  
    helpers.assertFile('package.json');
  
    helpers.assertFile('test/index.html');
  
    helpers.assertFile('test/lib/chai.js');
  
    helpers.assertFile('test/lib/expect.js');
  
    helpers.assertFile('test/lib/mocha/mocha.css');
  
    helpers.assertFile('test/lib/mocha/mocha.js');
  
    helpers.assertFile('test/runner/mocha.js');
  
    helpers.assertFile('app/scripts/routes/application-router.js');
  
    helpers.assertFile('app/scripts/views/application-view.js');
  
    helpers.assertFile('app/scripts/templates/application.ejs');
  
    helpers.assertFile('app/scripts/models/application-model.js');
  
    helpers.assertFile('app/scripts/collections/application-collection.js');
  
  });

  it('runs sucessfully with --coffee as argument', function(done) {
    helpers.runGenerator('backbone', {coffee: true} ,done);
  });

  it('creates expected files when run with --coffee as argument', function(){
    helpers.assertFile('app/scripts/main.coffee');

    helpers.assertFile('app/scripts/routes/application-router.coffee');

    helpers.assertFile('app/scripts/views/application-view.coffee');

    helpers.assertFile('app/scripts/models/application-model.coffee');

    helpers.assertFile('app/scripts/collections/application-collection.coffee');
  });

  it('runs successfully with --test-framework as argument', function(done) {
    helpers.runGenerator('backbone', {'test-framework': 'jasmine'} ,done);
  });

  it('creates jasmine files when run with --test-framework',function(){
    helpers.assertFile('test/runner/headless.js');

    helpers.assertFile('test/runner/html.js');

    helpers.assertFile('test/lib/jasmine-1.2.0/jasmine.css');

    helpers.assertFile('test/lib/jasmine-1.2.0/jasmine-html.js');

    helpers.assertFile('test/lib/jasmine-1.2.0/jasmine.js');

    helpers.assertFile('test/spec/');

    helpers.assertFile('test/spec/introduction.js');
  });

});
