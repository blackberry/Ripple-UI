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

// NOTE: missing view, detail, touches, targetTouches, scale and rotation
function _initTouchEvent(type, canBubble, cancelable, eventData) {
    var touchEvent = emulatorBridge.document().createEvent("Event");
    touchEvent.initEvent(type, canBubble, cancelable);
    utils.mixin(eventData, touchEvent);
    return touchEvent;
}

function _raiseTouchEvent(mouseEvent) {
    var type = "",
        preventDefault = false,
        simulatedEvent,
        touchObj,
        eventData;

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
        clientX: mouseEvent.pageX,
        clientY: mouseEvent.pageY,
        identifier: "",
        pageX: mouseEvent.pageX,
        pageY: mouseEvent.pageY,
        screenX: mouseEvent.pageX,
        screenY: mouseEvent.pageY,
        target: mouseEvent.target
    };

    eventData = {
        altKey: mouseEvent.altKey,
        ctrlKey: mouseEvent.ctrlKey,
        shiftKey: mouseEvent.shiftKey,
        metaKey: mouseEvent.metaKey,
        changedTouches: [touchObj],
        targetTouches: [touchObj],
        touches: [touchObj]
    };

    utils.mixin(touchObj, eventData);

    simulatedEvent = _initTouchEvent(type, true, true, eventData);

    mouseEvent.target.dispatchEvent(simulatedEvent);

    if (typeof mouseEvent.target["on" + type] === "function") {
        mouseEvent.target["on" + type].apply(mouseEvent.target, [simulatedEvent]);
    }

    if (preventDefault) {
        mouseEvent.preventDefault();
    }
}

function _marshalEvents(win, doc) {
    utils.forEach(["mousedown", "mousemove", "mouseup"],
        function (event) {
            doc.addEventListener(event, _raiseTouchEvent, true);
        });

    win.Node.prototype.ontouchstart = null;
    win.Node.prototype.ontouchend = null;
    win.Node.prototype.ontouchmove = null;
}

self = module.exports = {
    mask: function (win, doc) {
        win.addEventListener("DOMContentLoaded", function () {
            _marshalEvents(win, doc);
        });
    }
};
