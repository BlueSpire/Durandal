
describe('something', function(){
  it('should work', function(done){
    this.timeout(0);
    setTimeout(function(){
      done();
    }, 5999);
  })
})
