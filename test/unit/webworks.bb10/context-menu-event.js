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
describe('ContextMenuEvent', function () {

    var event = require('ripple/event'),
        eventHandler,
        a,
        win = window,
        doc = win.document,
        body = doc.body,
        createMouseEvent = function (type) {
            var e = doc.createEvent("MouseEvents");
            e.initMouseEvent(type,
                true, true, window,
                0, 0, 0, 0, 0,
                false, false, false, false, 0, null);
            return e;
        },
        simulateLongPressEventOnElement = function (element) {
            var mousedownevent;
            element.addEventListener('mousedown', function (e) {
                mousedownevent = e;
            });
            element.dispatchEvent(createMouseEvent('mousedown'));
            element.dispatchEvent(createMouseEvent('mouseup'));
            event.trigger('LongPressEvent', [mousedownevent], true);
        };


    require('ripple/platform/webworks.bb10/1.0.0/context-menu-event');

    window.getSelection = function () {
        return {
            rangeCount: 0,
            getRangeAt: function () {}
        };
    };

    beforeEach(function () {
        eventHandler = jasmine.createSpy();
        event.once('ContextMenuEvent', eventHandler);
        a = doc.createElement('a');
        body.appendChild(a);
    });

    afterEach(function () {
        body.removeChild(a);
    });

    it('fires with LINK context if the target is an anchor', function () {
        simulateLongPressEventOnElement(a);
        expect(eventHandler).toHaveBeenCalledWith('LINK');
    });

    it('fires with IMAGE_LINK context if the target is an image wrapped in a link', function () {
        var img = doc.createElement('img');
        a.appendChild(img);
        simulateLongPressEventOnElement(img);
        expect(eventHandler).toHaveBeenCalledWith('IMAGE_LINK');
    });

    it('fires with LINK context if the target is inside an anchor', function () {
        var em = doc.createElement('em');
        a.appendChild(em);
        simulateLongPressEventOnElement(em);
        expect(eventHandler).toHaveBeenCalledWith('LINK');
    });

    it('traps and buries the subsequent click event after LINK context fires', function () {
        var clickHandler = jasmine.createSpy();
        a.addEventListener('click', clickHandler, true);
        simulateLongPressEventOnElement(a);
        expect(eventHandler).toHaveBeenCalledWith('LINK');
        expect(clickHandler).not.toHaveBeenCalled();
    });

    it('fires with IMAGE context if the target is an image not wrapped in a link', function () {
        var img = doc.createElement('img');
        body.appendChild(img);
        simulateLongPressEventOnElement(img);
        expect(eventHandler).toHaveBeenCalledWith('IMAGE');
    });

    it('fires with INPUT context if the target is a form field', function () {
        var input = doc.createElement('input');
        body.appendChild(input);
        simulateLongPressEventOnElement(input);
        expect(eventHandler).toHaveBeenCalledWith('INPUT');
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
        simulateLongPressEventOnElement(a);
        expect(eventHandler).toHaveBeenCalledWith('TEXT');
    });
});
