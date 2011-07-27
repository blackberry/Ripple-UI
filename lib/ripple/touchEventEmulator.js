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
var emulatorBridge = require('ripple/emulatorBridge'),
    utils = require('ripple/utils'),
    _isMouseDown, self;

function _initTouchEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey,
                     altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation) {
    var touchEvent = emulatorBridge.getWidgetDocument().createEvent("Event");
    touchEvent.initEvent(type, canBubble, cancelable);
    touchEvent.altKey = altKey;
    touchEvent.changedTouches = changedTouches;

    return touchEvent;
}

function _raiseTouchEvent(mouseEvent) {
    var type = "",
        preventDefault = false,
        simulatedEvent,
        touchObj;

    switch (mouseEvent.type) {
    case "mousedown":
        type = "touchstart";
        _isMouseDown = true;
        break;
    case "mousemove":
        if (!_isMouseDown) {
            return;
        }
        type = "touchmove";
        preventDefault = true;
        break;
    case "mouseup":
        type = "touchend";
        _isMouseDown = false;
        break;
    default:
        return;
    }

    touchObj = {
        clientX: mouseEvent.clientX,
        clientY: mouseEvent.clientY,
        identifier: "",
        pageX: mouseEvent.pageX,
        pageY: mouseEvent.pageY,
        screenX: mouseEvent.screenX,
        screenY: mouseEvent.screenY,
        target: mouseEvent.target
    };

    simulatedEvent = _initTouchEvent(type, true, true, emulatorBridge.getWidgetDocument(), 1, mouseEvent.screenX, mouseEvent.screenY,
            mouseEvent.clientX, mouseEvent.clientY, mouseEvent.ctrlKey, mouseEvent.altKey, mouseEvent.shiftKey, mouseEvent.metaKey, [], [], [touchObj], 1, 0);

    mouseEvent.target.dispatchEvent(simulatedEvent);
    if (typeof mouseEvent.target["on" + type] === "function") {
        mouseEvent.target["on" + type].apply(mouseEvent.target, [simulatedEvent]);
    }

    if (preventDefault) {
        mouseEvent.preventDefault();
    }
}

function _marshalEvents(doc) {
    utils.forEach(["mousedown", "mousemove", "mouseup"],
        function (event) {
            doc.addEventListener(event, _raiseTouchEvent, true);
        });
}

self = module.exports = {
    mask: function (frame) {
        frame.contentWindow.addEventListener("DOMContentLoaded", function () {
            _marshalEvents(frame.contentDocument);
        });
    },
    // void initTouchEvent( in DOMString type, in boolean canBubble, in boolean cancelable, in DOMWindow view, in long detail,
    // in long screenX, in long screenY, in long clientX, in long clientY, in boolean ctrlKey, in boolean altKey,
    // in boolean shiftKey, in boolean metaKey, in TouchList touches, in TouchList targetTouches,
    // in TouchList changedTouches, in float scale, in float rotation);
    initTouchEvent: function (type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation) {
        return _initTouchEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, touches, targetTouches, changedTouches, scale, rotation);
    }
};
