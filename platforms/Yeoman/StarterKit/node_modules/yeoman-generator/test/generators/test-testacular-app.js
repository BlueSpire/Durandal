
var path    = require('path');
var helpers = require('../..').test;

describe('Testacular:App generator test', function() {
  before(helpers.before(path.join(__dirname, './temp')));

  it('runs sucessfully', function(done) {
    helpers.runGenerator('testacular:app', done);
  });

  it('creates expected files', function() {
   
    helpers.assertFile('testacular.conf.js');
  
  });
});
