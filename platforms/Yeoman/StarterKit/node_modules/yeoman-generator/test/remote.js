/*global describe it */
var generators = require('..');


describe.skip('remote package', function () {
  this.timeout(0);

  it('env.remote(name)', function (done) {
    var env = generators();
    env.remote('mklabs/generators#generator-backbone', done);
  });

  it('init from remote', function (done) {
    generators(['mklabs/generators#generator-angular', 'mklabs/generators#generator-chromeapp'])
      .run(done);
  });
});
