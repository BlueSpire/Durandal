/*global define*/
define(['durandal/viewEngine', 'durandal/system'], function (sut, system) {
    describe('isViewUrl', function () {
        it('returns false when view extension not found', function () {
            var isViewUrl = sut.isViewUrl('test');

            expect(isViewUrl).toBe(false);
        });

        it('returns true when view extension found', function () {
            var isViewUrl = sut.isViewUrl('test.html');

            expect(isViewUrl).toBe(true);
        });
    });

    describe('convertViewUrlToViewId', function () {
        it('returns view id', function () {
            var viewId = sut.convertViewUrlToViewId('test.html');

            expect(viewId).toBe('test');
        });
    });

    describe('convertViewIdToRequirePath', function () {
        it('returns require path', function () {
            var viewId = sut.convertViewIdToRequirePath('test');

            expect(viewId).toBe('text!test.html');
        });
    });

    describe('parseMarkup', function () {
        describe('with single node', function () {
            it('returns dom element', function () {
                var markup = sut.parseMarkup('<div>test</div>');

                expect(markup.nodeType).toBe(1);
                expect(markup.innerText).toBe('test');
                expect(markup.childNodes[0].nodeType).toBe(3);
            });
        });

        describe('with multiple nodes', function () {
            it('returns wrapped dom element', function () {
                var markup = sut.parseMarkup('<div>test</div><div>test</div>');

                expect(markup.className).toBe('durandal-wrapper');
                expect(markup.childNodes.length).toBe(2);
            });
        });

        describe('with comments', function () {
            it('returns dom element with comments removed', function () {
                var markup = sut.parseMarkup('<!-- this is a comment --><div>test</div>');

                expect(markup.nodeType).toBe(1);
                expect(markup.innerText).toBe('test');
                expect(markup.childNodes[0].nodeType).toBe(3);
            });
        });
    });

    describe('createView', function () {
        it('view acquire and data-view attribute added', function () {
            spyOn(system, 'acquire').andCallFake(function (req) {
                var d = system.defer();
                d.resolve('<div>test</div>');
                return d.promise();
            });
            var view = sut.createView('test');

            expect(system.acquire).toHaveBeenCalledWith('text!test.html');

            view.done(function (view) {
                expect($(view).data('view')).toBe('test');
            });
        });
    });
});