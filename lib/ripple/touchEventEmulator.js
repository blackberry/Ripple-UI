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

var utils = require('ripple/utils'),
    event = require('ripple/event'),
    _isMouseDown,
    _win,
    _doc,
    _longPressTimer,
    _longPressDuration = 450,
    self;

// NOTE: missing view, detail, touches, targetTouches, scale and rotation
function _initTouchEvent(type, canBubble, cancelable, eventData) {
    var touchEvent = _doc.createEvent("Event");
    touchEvent.initEvent(type, canBubble, cancelable);
    utils.mixin(eventData, touchEvent);
    return touchEvent;
}

function _simulateTouchEvent(type, mouseevent) {
    var simulatedEvent,
        touchObj,
        eventData;

    touchObj = {
        clientX: mouseevent.pageX,
        clientY: mouseevent.pageY,
        identifier: "",
        pageX: mouseevent.pageX,
        pageY: mouseevent.pageY,
        screenX: mouseevent.pageX,
        screenY: mouseevent.pageY,
        target: mouseevent.target
    };

    eventData = {
        altKey: mouseevent.altKey,
        ctrlKey: mouseevent.ctrlKey,
        shiftKey: mouseevent.shiftKey,
        metaKey: mouseevent.metaKey,
        changedTouches: [touchObj],
        targetTouches: [touchObj],
        touches: [touchObj]
    };

    utils.mixin(touchObj, eventData);

    simulatedEvent = _initTouchEvent(type, true, true, eventData);

    mouseevent.target.dispatchEvent(simulatedEvent);

    if (typeof mouseevent.target["on" + type] === "function") {
        mouseevent.target["on" + type].apply(mouseevent.target, [simulatedEvent]);
    }
}

function _translateMouseEvent(mouseevent) {
    var type = "";

    switch (mouseevent.type) {
    case "mousedown":
        type = "touchstart";
        _isMouseDown = true;
        clearTimeout(_longPressTimer);
        _longPressTimer = setTimeout(function () {
            //HACK: Taking out Context Menu
            //event.trigger('LongPressEvent', [mouseevent]);
        }, _longPressDuration);
        break;
    case "mousemove":
        if (!_isMouseDown) {
            return;
        }
        type = "touchmove";
        break;
    case "mouseup":
        type = "touchend";
        _isMouseDown = false;
        clearTimeout(_longPressTimer);
        break;
    default:
        return;
    }

    _simulateTouchEvent(type, mouseevent);
}

function _marshalEvents(win, doc) {
    utils.forEach(["mousedown", "mousemove", "mouseup"],
        function (event) {
            doc.addEventListener(event, _translateMouseEvent, true);
        });
    _doc = doc;
    _win = win;
    win.Node.prototype.ontouchstart = null;
    win.Node.prototype.ontouchend = null;
    win.Node.prototype.ontouchmove = null;
}

self = module.exports = {
    init: function (win, doc, longPressDuration) {
        // optionally supploy the longPressDuration (to speed up unit tests)
        if (typeof(longPressDuration) !== 'undefined' &&
            parseInt(longPressDuration, 10) === longPressDuration) {
            _longPressDuration = longPressDuration;
        }
        _marshalEvents(win, doc);
    }
};
