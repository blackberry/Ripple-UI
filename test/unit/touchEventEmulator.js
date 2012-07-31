/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
describe('touchEventEmulator', function () {
    var event = require('ripple/event'),
        jsdom = require('jsdom'),
        win, doc,
        mockMouseEvent = function (type) {
            var e = doc.createEvent("MouseEvents");
            e.initMouseEvent(type,
                true, true, win,
                0, 0, 0, 0, 0,
                false, false, false, false, 0, null);
            return e;
        };

    beforeEach(function () {
        win = jsdom.jsdom().createWindow('<html><body></body></html>');
        win.location.path = '';
        win.getSelection = function () {
            return {
                rangeCount: 0
            };
        };
        doc = win.document;
        var emulator = require('ripple/touchEventEmulator');
        emulator.mask(win, doc);
    });

    describe('mouse events are converted to touch events', function () {
        var eventHandler, body;

        beforeEach(function () {
            body = doc.body;
            eventHandler = jasmine.createSpy();
        });

        it('masks the mousedown event as touchstart', function () {
            body.addEventListener('touchstart', eventHandler);
            body.dispatchEvent(mockMouseEvent('mousedown'));
            expect(eventHandler).toHaveBeenCalled();
        });

        it('masks the mouseup event as touchend', function () {
            body.addEventListener('touchend', eventHandler);
            body.dispatchEvent(mockMouseEvent('mouseup'));
            expect(eventHandler).toHaveBeenCalled();
        });

        it('does not fire touchmove without mousedown', function () {
            body.addEventListener('touchmove', eventHandler);
            body.dispatchEvent(mockMouseEvent('mousemove'));
            expect(eventHandler).not.toHaveBeenCalled();
        });

        it('fires a mousemove after mousedown as touchmove', function () {
            body.addEventListener('touchmove', eventHandler);
            body.dispatchEvent(mockMouseEvent('mousedown'));
            body.dispatchEvent(mockMouseEvent('mousemove'));
            expect(eventHandler).toHaveBeenCalled();
        });

        it('does not fire touchmove after mouseup', function () {
            body.addEventListener('touchmove', eventHandler);
            body.dispatchEvent(mockMouseEvent('mousedown'));
            body.dispatchEvent(mockMouseEvent('mouseup'));
            body.dispatchEvent(mockMouseEvent('mousemove'));
            expect(eventHandler).not.toHaveBeenCalled();
        });
    });

    describe('pressing and holding fires a ContextMenuEvent on the ripple event bus', function () {
        var eventHandler, a;

        beforeEach(function () {
            a = doc.createElement('a');
            doc.body.appendChild(a);
            eventHandler = jasmine.createSpy();
            event.on('ContextMenuEvent', eventHandler);
        });

        it('fires after a long press', function () {
            runs(function () {
                a.dispatchEvent(mockMouseEvent('mousedown'));
            });
            waitsFor(function () {
                return eventHandler.wasCalled;
            }, 'Event handler was not called', 1000);
        });

        it('does not fire after a short press', function () {
            runs(function () {
                a.dispatchEvent(mockMouseEvent('mousedown'));
                waits(50);
                a.dispatchEvent(mockMouseEvent('mouseup'));
            });
            waits(1000);
            expect(eventHandler).not.toHaveBeenCalled();
        });

        it('does not fire after two consecutive short presses', function () {
            runs(function () {
                a.dispatchEvent(mockMouseEvent('mousedown'));
                waits(100);
                a.dispatchEvent(mockMouseEvent('mousedown'));
            });
            expect(eventHandler).not.toHaveBeenCalled();
        });

        it('fires with IMAGE_LINK context if the target is an image wrapped in a link', function () {
            var img = doc.createElement('img');
            a.appendChild(img);
            runs(function () {
                a.dispatchEvent(mockMouseEvent('mousedown'));
            });
            waitsFor(function () {
                return eventHandler.wasCalled;
            }, 'Event handler was not called', 1000);
            runs(function () {
                expect(eventHandler).toHaveBeenCalledWith('LINK');
            });
        });

        it('fires with IMAGE context if the target is an image not wrapped in a link', function () {
            var img = doc.createElement('img');
            doc.body.appendChild(img);
            runs(function () {
                img.dispatchEvent(mockMouseEvent('mousedown'));
            });
            waitsFor(function () {
                return eventHandler.wasCalled;
            }, 'Event handler was not called', 1000);
            runs(function () {
                expect(eventHandler).toHaveBeenCalledWith('IMAGE');
            });
        });

        it('fires with INPUT context if the target is a form field', function () {
            var input = doc.createElement('input');
            doc.body.appendChild(input);
            runs(function () {
                input.dispatchEvent(mockMouseEvent('mousedown'));
            });
            waitsFor(function () {
                return eventHandler.wasCalled;
            }, 'Event handler was not called', 1000);
            runs(function () {
                expect(eventHandler).toHaveBeenCalledWith('INPUT');
            });
        });

        it('fires with TEXT context if the browser window has a text selection', function () {
            win.getSelection = function () {
                return {
                    rangeCount: 1,
                    getRangeAt: function () {
                        return "Hello world!";
                    }
                };
            };
            runs(function () {
                a.dispatchEvent(mockMouseEvent('mousedown'));
            });
            waitsFor(function () {
                return eventHandler.wasCalled;
            }, 'Event handler was not called', 1000);
            runs(function () {
                expect(eventHandler).toHaveBeenCalledWith('TEXT');
            });
        });
    });
});
