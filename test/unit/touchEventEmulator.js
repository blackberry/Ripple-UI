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
        win, doc, body,
        longPressDuration = 100,
        longPressWait = 200,
        mockMouseEvent = function (type) {
            var e = doc.createEvent("MouseEvents");
            e.initMouseEvent(type,
                true, true, win,
                0, 0, 0, 0, 0,
                false, false, false, false, 0, null);
            return e;
        };

    beforeEach(function () {
        win = window;
        doc = win.document;
        body = doc.body;
        var emulator = require('ripple/touchEventEmulator');
        emulator.init(win, doc, longPressDuration);
    });

    describe('mouse events are translated into touch events', function () {
        var eventHandler;

        beforeEach(function () {
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

    xdescribe('pressing and holding fires a longpress event', function () {
        var eventHandler;

        beforeEach(function () {
            eventHandler = jasmine.createSpy();
            event.on('LongPressEvent', eventHandler);
        });

        it('fires after a long press', function () {
            runs(function () {
                body.dispatchEvent(mockMouseEvent('mousedown'));
            });
            waitsFor(function () {
                return eventHandler.wasCalled;
            }, 'longpress was not fired', longPressWait);
        });

        it('does not fire after a short press', function () {
            runs(function () {
                body.dispatchEvent(mockMouseEvent('mousedown'));
                waits(20);
                body.dispatchEvent(mockMouseEvent('mouseup'));
            });
            waits(longPressWait);
            expect(eventHandler).not.toHaveBeenCalled();
        });
    });
});
