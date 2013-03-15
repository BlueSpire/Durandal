/*global define, jasmine, ko*/
define(['durandal/viewModelBinder', 'durandal/system'], function (sut, system) {
    var obj = {
            setView: function () {}
        },
        bindingObj,
        view;

    function sharedBindingBehaviour(createBindingObj, sutAction, expectSetViewToBeCalled) {
        var insufficientInfoMessage = 'Insufficient Information to Bind',
            unexpectedViewMessage = 'Unexpected View Type',
            viewName = 'view name';

        beforeEach(function() {
            bindingObj = createBindingObj();
            view = {
                getAttribute: function () { return viewName; }
            };
            sut.throwOnErrors = false;
            if (!ko.applyBindings.isSpy) {
                spyOn(ko, 'applyBindings');
            }
            spyOn(system, 'log');
        });

        it('logs and returns with null view', function () {
            view = null;

            sutAction();

            expect(system.log).toHaveBeenCalledWith(insufficientInfoMessage, null, bindingObj);
            expect(ko.applyBindings).not.toHaveBeenCalledWith(bindingObj, view);
        });

        it('logs and returns with null obj', function () {
            bindingObj = null;

            sutAction();

            expect(system.log).toHaveBeenCalledWith(insufficientInfoMessage, view, null);
            expect(ko.applyBindings).not.toHaveBeenCalledWith(bindingObj, view);
        });

        it('logs and returns with no getAttribute function on view', function () {
            view.getAttribute = null;

            sutAction();

            expect(system.log).toHaveBeenCalledWith(unexpectedViewMessage, view, bindingObj);
            expect(ko.applyBindings).not.toHaveBeenCalledWith(bindingObj, view);
        });

        it('applies bindings with before and after hooks', function () {
            var bindStatus = 0;
            spyOn(sut, 'beforeBind').andCallFake(function (objArg, viewArg) {
                expect(objArg).toBe(bindingObj);
                expect(viewArg).toBe(view);
                expect(bindStatus).toBe(0);
                bindStatus = 1;
            });
            ko.applyBindings.andCallFake(function () {
                expect(bindStatus).toBe(1);
                bindStatus = 2;
            });
            spyOn(sut, 'afterBind').andCallFake(function (objArg, viewArg) {
                expect(objArg).toBe(bindingObj);
                expect(viewArg).toBe(view);
                expect(bindStatus).toBe(2);
            });
            spyOn(bindingObj, 'setView');

            sutAction();

            expect(system.log).toHaveBeenCalledWith('Binding', viewName, bindingObj);
            expect(ko.applyBindings).toHaveBeenCalledWith(bindingObj, view);

            if (expectSetViewToBeCalled) {
                expect(bindingObj.setView).toHaveBeenCalledWith(view);
            }
        });

        it('does not throw with null setView', function () {
            bindingObj.setView = null;

            sutAction();
        });

        it('logs binding error', function () {
            ko.applyBindings.andCallFake(function () {
                throw new Error('FakeError');
            });

            sutAction();

            expect(system.log).toHaveBeenCalledWith('FakeError', viewName, bindingObj);
        });

        describe('with throw errors set', function () {
            beforeEach(function() {
                sut.throwOnErrors = true;
            });

            it('throws and returns with null view', function () {
                view = null;

                expect(function () { sutAction(); }).toThrow(insufficientInfoMessage);
                expect(ko.applyBindings).not.toHaveBeenCalledWith(bindingObj, view);
            });

            it('throws and returns with null obj', function () {
                bindingObj = null;

                expect(function () { sutAction(); }).toThrow(insufficientInfoMessage);
                expect(ko.applyBindings).not.toHaveBeenCalledWith(bindingObj, view);
            });

            it('throws and returns with no getAttribute function on view', function () {
                view.getAttribute = null;

                expect(function () { sutAction(); }).toThrow(unexpectedViewMessage);
                expect(ko.applyBindings).not.toHaveBeenCalledWith(bindingObj, view);
            });

            it('throws binding error', function () {
                ko.applyBindings.andCallFake(function () {
                    throw new Error('FakeError');
                });

                expect(function () { sutAction(); }).toThrow(jasmine.any(String));
            });
        });
    }

    describe('bind', function () {
        sharedBindingBehaviour(function () { return obj; }, function () { sut.bind(bindingObj, view); }, true);
    });

    describe('bindContext', function () {
        var bindingContext = {
            createChildContext: function () { return bindingObj; }
        };

        describe('child context used', function () {
            sharedBindingBehaviour(function () { return obj; }, function () { sut.bindContext(bindingContext, view, obj); }, true);
        });

        describe('child context not used', function () {
            sharedBindingBehaviour(function () { return obj; }, function () { sut.bindContext(bindingObj, view, null); }, false);
        });
    });
});