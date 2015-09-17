define(['plugins/observable'], function (sut) {
    describe('plugins/observable', function(){

        describe('constructor', function () {
            var viewmodel;

            beforeEach(function() {
                sut.install({
                    changeDetection: 'hasChanged'
                });

                viewmodel = {
                    hasChanged: function() {
                        return;
                    },
                    foo: 'foo'
                };
                spyOn(viewmodel, 'hasChanged').and.callThrough();

                sut(viewmodel, 'foo');
                viewmodel.foo = 'bar';
            });

            it('should have a "hasChanged" property of type function', function() {
                expect(viewmodel.hasChanged).toBeDefined();
            });

            it('should have called "hasChanged"', function() {
                expect(viewmodel.hasChanged).toHaveBeenCalled();
            });

            it('should return the value', function () {
                expect(sut(viewmodel, 'foo')()).toEqual('bar');
            });
        });

    });
});
