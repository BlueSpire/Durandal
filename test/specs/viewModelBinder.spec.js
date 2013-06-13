define(['durandal/viewModelBinder', 'durandal/system', 'knockout'], function (sut, system, ko) {
    describe('durandal/viewModelBinder', function(){

        var obj = {
                name:'test module'
            },
            bindingObj,
            view;

        function sharedBindingBehaviour(createBindingObj, sutAction) {
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

                sutAction();

                expect(system.log).toHaveBeenCalledWith('Binding', viewName, bindingObj);
                expect(ko.applyBindings).toHaveBeenCalledWith(bindingObj, view);
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
            sharedBindingBehaviour(function () { return obj; }, function () { sut.bind(bindingObj, view); });
        });

        describe('bindContext', function () {
            var bindingContext = {
                createChildContext: function () { return bindingObj; }
            };

            describe('child context used', function () {
                sharedBindingBehaviour(function () { return obj; }, function () { sut.bindContext(bindingContext, view, obj); });
            });

            describe('child context not used', function () {
                sharedBindingBehaviour(function () { return obj; }, function () { sut.bindContext(bindingObj, view, null); });
            });
        });
    });
});