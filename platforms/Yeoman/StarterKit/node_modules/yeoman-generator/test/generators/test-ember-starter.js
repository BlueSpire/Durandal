
var path    = require('path');
var helpers = require('../..').test;

describe('Ember-Starter generator test', function() {
  before(helpers.before(path.join(__dirname, './temp')));

  it('runs sucessfully', function(done) {
    helpers.runGenerator('ember-starter', done);
  });

  it('creates expected files', function() {
   
    helpers.assertFile('app/scripts');
  
    helpers.assertFile('app/styles');
  
    helpers.assertFile('app/scripts/app.js');
  
    helpers.assertFile('app/scripts/libs/ember-1.0.pre.js');
  
    helpers.assertFile('app/scripts/libs/handlebars-1.0.0.beta.6.js');
  
    helpers.assertFile('app/scripts/libs/jquery-1.7.2.min.js');
  
    helpers.assertFile('app/index.html');
  
    helpers.assertFile('app/styles/style.css');
  
    helpers.assertFile('Gruntfile.js');
  
  });
});
