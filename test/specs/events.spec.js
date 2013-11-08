/*global jasmine, describe, beforeEach, it, expect, require, xdescribe, xit */
define(['durandal/events'], function( Events ) {
    describe('Durandal/Events AMD', function() {
        "use strict";

        describe('on and trigger', function() {
            var obj = { counter: 0 };
            Events.includeIn(obj);
            obj.on('event', function() {
                obj.counter += 1;
            });

            it('counter should be incremented', function() {
                obj.trigger('event');
                expect(obj.counter).toBe(1);
            });

            it('counter should be incremented five times', function() {

                obj.trigger('event');
                obj.trigger('event');
                obj.trigger('event');
                obj.trigger('event');

                expect(obj.counter).toBe(5);
            });

            it('binding and triggering should support multiple events ', function() {
                obj = {counter: 0};
                Events.includeIn(obj);

                obj.trigger('event');

                obj.on('a b c', function() {
                    obj.counter += 1;
                });

                obj.trigger('a');
                expect(obj.counter).toBe(1);

                obj.trigger('a b');

                expect(obj.counter).toBe(3);

                obj.trigger('c');
                expect(obj.counter).toBe(4);

                obj.off('a c');
                obj.trigger('a b c');
                expect(obj.counter).toBe(5);
            });

            it('should trigger all for each event', function() {
                var a, b, obj = { counter: 0 };
                Events.includeIn(obj);

                obj.on('all',function( event ) {
                    obj.counter++;
                    if ( event === 'a' ) {
                        a = true;
                    }
                    if ( event === 'b' ) {
                        b = true;
                    }
                }).trigger('a b');
                expect(a).toBeTruthy();
                expect(b).toBeTruthy();
                expect(obj.counter).toBe(2);

            });
        });

        describe('on, then unbind all functions', function() {
            var obj = { counter: 0 };
            Events.includeIn(obj);
            var callback = function() {
                obj.counter += 1;
            };

            obj.on('event', callback);
            obj.trigger('event');
            obj.off('event');
            obj.trigger('event');

            it('counter should have only been incremented once', function() {
                expect(obj.counter).toBe(1);
            });
        });

        describe('bind two callbacks, unbind only one', function() {
            var obj = { counterA: 0, counterB: 0 };
            Events.includeIn(obj);
            var callback = function() {
                obj.counterA += 1;
            };

            obj.on('event', callback);
            obj.on('event', function() {
                obj.counterB += 1;
            });

            obj.trigger('event');
            obj.off('event', callback);
            obj.trigger('event');

            it('counterA should have only been incremented once.', function() {
                expect(obj.counterA).toBe(1);
            });
            it('counterB should have been incremented twice.', function() {
                expect(obj.counterB).toBe(2);
            });
        });

        describe('unbind a callback in the midst of it firing', function() {
            var obj = {counter: 0};
            Events.includeIn(obj);
            var callback = function() {
                obj.counter += 1;
                obj.off('event', callback);
            };
            obj.on('event', callback);
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');
            it('the callback should have been unbound.', function() {
                expect(obj.counter).toBe(1);
            });
        });

        describe('two binds that unbind themselves', function() {
            var obj = { counterA: 0, counterB: 0 };
            Events.includeIn(obj);
            var incrA = function() {
                obj.counterA += 1;
                obj.off('event', incrA);
            };
            var incrB = function() {
                obj.counterB += 1;
                obj.off('event', incrB);
            };
            obj.on('event', incrA);
            obj.on('event', incrB);
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');
            it('counterA should have only been incremented once.', function() {
                expect(obj.counterA).toBe(1);
            });
            it('counterA should have only been incremented once..', function() {
                expect(obj.counterB).toBe(1);
            });
        });

        describe('bind a callback with a supplied context', function() {
            var TestClass = function() {
                return this;
            };
            TestClass.prototype.assertTrue = function() {
                it('this` should be bound to the callback`', function() {
                    expect(true).toBeTruthy();
                });
            };

            var obj = {};
            Events.includeIn(obj);
            obj.on('event', function() {
                this.assertTrue();
            }, (new TestClass()));
            obj.trigger('event');
        });

        describe('nested trigger with unbind', function() {
            var obj = { counter: 0 };
            Events.includeIn(obj);

            var incr1 = function() {
                obj.counter += 1;
                obj.off('event', incr1);
                obj.trigger('event');
            };
            var incr2 = function() {
                obj.counter += 1;
            };
            obj.on('event', incr1);
            obj.on('event', incr2);
            obj.trigger('event');
            it('counter should have incremented three times', function() {
                expect(obj.counter).toBe(3);
            });
        });

        describe('callback list is not altered during trigger', function() {
            var counter = 0;
            var obj = { };
            var incr = function() {
                counter++;
            };
            Events.includeIn(obj);

            it('bind should not alter callback list', function() {
                obj.on('event', function() {
                    obj.on('event', incr);
                    obj.on('all', incr);
                });
                obj.trigger('event');
                expect(counter).toBe(0);
            });

            it('unbind should not alter callback list', function() {
                obj.off();
                obj.on('event', function() {
                    obj.off('event', incr);
                    obj.off('all', incr);
                });
                obj.on('event', incr);
                obj.on('all', incr);

                obj.trigger('event');

                expect(counter).toBe(2);
            });

        });

        xit('if no callback is provided, `on` should be a noop', function() {
            var obj = {};
            Events.includeIn(obj);
            var result = obj.on('test').trigger('test');
            expect(result).toBeNull();
        });

        xit('if callback is truthy but not a function, `on` should throw an error just like jQuery', function() {
            var view = {};
            Events.includeIn(view);

            view.on('test', 'noop');
            view.trigger('test');
        });

        describe('off', function() {

            it('should remove all events for a specific context', function() {
                var obj = {};
                Events.includeIn(obj);

                obj.on('x y all', function() {
                    expect(true).toBeTruthy();
                });
                obj.on('x y all', function() {
                    expect(false).toBeTruthy();
                }, obj);
                obj.off(null, null, obj);
                obj.trigger('x y');
            });

            it('should remove all events for a specific callback', function() {
                var obj = {};
                Events.includeIn(obj);
                var success = function() {
                    expect(true).toBeTruthy();
                };
                var fail = function() {
                    expect(false).toBeTruthy();
                };

                obj.on('x y all', success);
                obj.on('x y all', fail);
                obj.off(null, fail);
                obj.trigger('x y');
            });

            it('should not skip consecutive events', function() {
                var obj = {};
                Events.includeIn(obj);
                obj.on('event', function() {
                    expect(false).toBeTruthy();
                }, obj);
                obj.on('event', function() {
                    expect(false).toBeTruthy();
                }, obj);
                obj.off(null, null, obj);
                obj.trigger('event');
            });

        });

        describe('event functions', function() {
            var obj = {};
            var obj2 = {};
            var fn = function() {
                expect(true).toBeTruthy();
            };
            Events.includeIn(obj);
            Events.includeIn(obj2);

            it('should be chainable', function() {
                expect(obj).toEqual(obj.trigger('noeventssetyet'));
                expect(obj).toEqual(obj.off('noeventssetyet'));
                expect(obj).toEqual(obj.on('a', fn));
                expect(obj).toEqual(obj.trigger('a'));
                expect(obj).toEqual(obj.off('a'));
            });
        });

    });
});