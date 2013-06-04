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

    describe('processMarkup', function () {
        describe('with single node', function () {
            it('returns dom element', function () {
                var markup = sut.processMarkup('<div>test</div>');

                expect(markup.nodeType).toBe(1);
                expect(markup.innerText).toBe('test');
                expect(markup.childNodes[0].nodeType).toBe(3);
            });
        });

        describe('with multiple nodes', function () {
            it('returns wrapped dom element', function () {
                var markup = sut.processMarkup('<div>test</div><div>test</div>');

                expect(markup.className).toBe('durandal-wrapper');
                expect(markup.childNodes.length).toBe(2);
            });
        });

        describe('with comments', function () {
            it('returns dom element with comments removed', function () {
                var markup = sut.processMarkup('<!-- this is a comment --><div>test</div>');

                expect(markup.nodeType).toBe(1);
                expect(markup.innerText).toBe('test');
                expect(markup.childNodes[0].nodeType).toBe(3);
            });
        });
    });

    describe('processMarkup with alternate parseMarkup', function () {

        var oldParseMarkup = null;
        var spyable = null;

        beforeEach(function () {
            spyable = {
                parseIt: function (markup) {
                    return $.parseHTML(markup);
                }
            };

            oldParseMarkup = sut.parseMarkup;
            var spied = spyOn(spyable, 'parseIt').andCallThrough();
            sut.parseMarkup = spied;
        });

        afterEach(function () {
            sut.parseMarkup = oldParseMarkup;
            oldParseMarkup = null;
            spyable = null;
        });

        describe('with single node', function () {
            it('returns dom element', function () {
                var markup = sut.processMarkup('<div>test</div>');

                expect(spyable.parseIt).toHaveBeenCalled();
                expect(markup.nodeType).toBe(1);
                expect(markup.innerText).toBe('test');
                expect(markup.childNodes[0].nodeType).toBe(3);
            });
        });

        describe('with multiple nodes', function () {
            it('returns wrapped dom element', function () {
                var markup = sut.processMarkup('<div>test</div><div>test</div>');

                expect(spyable.parseIt).toHaveBeenCalled();
                expect(markup.className).toBe('durandal-wrapper');
                expect(markup.childNodes.length).toBe(2);
            });
        });

        describe('with comments', function () {
            it('returns dom element with comments removed', function () {
                var markup = sut.processMarkup('<!-- this is a comment --><div>test</div>');

                expect(spyable.parseIt).toHaveBeenCalled();
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