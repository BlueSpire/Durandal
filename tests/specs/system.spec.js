/*global define*/
define(['durandal/system'], function (sut) {
    describe('debug', function () {
        it('returns false when no arguments', function () {
            var isDebugging = sut.debug();

            expect(isDebugging).toBe(false);
        });

        it('sets debug value', function () {
            sut.debug(true);
            var isDebugging = sut.debug();

            expect(isDebugging).toBe(true);
        });
    });
});