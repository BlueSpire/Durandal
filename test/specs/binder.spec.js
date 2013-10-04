define(['durandal/binder', 'durandal/system', 'knockout'], function (sut, system, ko) {
    describe('durandal/binder', function(){
        var settings, view;

        function sharedBindingBehaviour(createSettings, sutAction) {
            var insufficientInfoMessage = 'Insufficient Information to Bind',
                unexpectedViewMessage = 'Unexpected View Type',
                viewName = 'view name';

            beforeEach(function() {
                settings = createSettings();

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

                expect(system.log).toHaveBeenCalled();
                expect(ko.applyBindings).not.toHaveBeenCalledWith(settings.bindingTarget, view);
            });

            it('logs and returns with null obj', function () {
                settings.bindingTarget = null;

                sutAction();

                expect(system.log).toHaveBeenCalled();
                expect(ko.applyBindings).not.toHaveBeenCalledWith(settings.bindingTarget, view);
            });

            it('logs and returns with no getAttribute function on view', function () {
                view.getAttribute = null;

                sutAction();

                expect(system.log).toHaveBeenCalled();
                expect(ko.applyBindings).not.toHaveBeenCalledWith(settings.bindingTarget, view);
            });

            it('applies bindings with before and after hooks', function () {
                var bindStatus = 0;
                spyOn(sut, 'binding').andCallFake(function (dataArg, viewArg) {
                    expect(dataArg).toBe(settings.data);
                    expect(viewArg).toBe(view);
                    expect(bindStatus).toBe(0);
                    bindStatus = 1;
                });
                ko.applyBindings.andCallFake(function () {
                    expect(bindStatus).toBe(1);
                    bindStatus = 2;
                });
                spyOn(sut, 'bindingComplete').andCallFake(function (dataArg, viewArg) {
                    expect(dataArg).toBe(settings.data);
                    expect(viewArg).toBe(view);
                    expect(bindStatus).toBe(2);
                });

                sutAction();

                expect(system.log).toHaveBeenCalled();
                expect(ko.applyBindings).toHaveBeenCalledWith(settings.bindingTarget, view);
            });

            it('logs binding error', function () {
                ko.applyBindings.andCallFake(function () {
                    throw new Error('FakeError');
                });

                sutAction();

                expect(system.log).toHaveBeenCalled();
            });

            describe('with throw errors set', function () {
                beforeEach(function() {
                    sut.throwOnErrors = true;
                });

                it('throws and returns with null view', function () {
                    view = null;

                    expect(function () { sutAction(); }).toThrow(insufficientInfoMessage);
                    expect(ko.applyBindings).not.toHaveBeenCalledWith(settings.bindingTarget, view);
                });

                it('throws and returns with null obj', function () {
                    settings.bindingTarget = null;

                    expect(function () { sutAction(); }).toThrow(insufficientInfoMessage);
                    expect(ko.applyBindings).not.toHaveBeenCalledWith(settings.bindingTarget, view);
                });

                it('throws and returns with no getAttribute function on view', function () {
                    view.getAttribute = null;

                    expect(function () { sutAction(); }).toThrow(unexpectedViewMessage);
                    expect(ko.applyBindings).not.toHaveBeenCalledWith(settings.bindingTarget, view);
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
            function createSettings(){
                var target = {};
                return{
                    obj:target,
                    bindingTarget:target,
                    data:target
                };
            };

            sharedBindingBehaviour(createSettings, function () {
                sut.bind(settings.bindingTarget, view);
            });
        });

        describe('bindContext', function () {
            describe('child context used', function () {
                function createSettings(){
                    var bindingObject = {};
                    var bindingContext = {
                        $data: bindingObject,
                        createChildContext: function () {
                            return bindingContext;
                        }
                    };

                    return{
                        obj:bindingObject,
                        bindingTarget:bindingContext,
                        data:bindingObject
                    };
                };

                sharedBindingBehaviour(createSettings, function () {
                    sut.bindContext(settings.bindingTarget, view, settings.data);
                });
            });

            describe('child context not used', function () {
                function createSettings(){
                    var bindingObject = {};
                    var bindingContext = {
                        $data: bindingObject,
                        createChildContext: function () {
                            return bindingObject;
                        }
                    };
                    return{
                        obj:bindingObject,
                        bindingTarget:bindingContext,
                        data:bindingObject
                    };
                };

                sharedBindingBehaviour(createSettings, function () {
                    sut.bindContext(settings.bindingTarget, view, null);
                });
            });
        });
    });
});