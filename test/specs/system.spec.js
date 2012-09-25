define(['durandal/system'], function (system) {
    describe('system debug', function () {
        it('returns true when no arguments', function () {
            var isDebugging = system.debug();

            expect(isDebugging).toBe(true);
        });

        it('sets debug value', function () {
            system.debug(false);
            var isDebugging = system.debug();

            expect(isDebugging).toBe(false);
        });

        describe('when passed truthy', function () {
            it('sets requireJs cache busting', function () {
                system.debug(true);
                var urlArgs = window.require.s.contexts._.config.urlArgs;

                expect(urlArgs).toContain('bust=');
            });

            it('logs debug enabled', function () {
                spyOn(console, 'log');
                system.debug(true);

                expect(console.log).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe('when passed falsey', function () {
            it('clears requireJs urlArgs', function () {
                window.require.config({
                    urlArgs: 'someArgs'
                });
                system.debug(false);
                var urlArgs = window.require.s.contexts._.config.urlArgs;

                expect(urlArgs).toBe('');
            });
        });
    });
});