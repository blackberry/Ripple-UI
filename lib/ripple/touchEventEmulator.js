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
    _longPressTimer,
    _isMouseDown,
    _win,
    _doc,
    _longPressDuration = 450,
    self;

// NOTE: missing view, detail, touches, targetTouches, scale and rotation
function _initTouchEvent(type, canBubble, cancelable, eventData) {
    var touchEvent = _doc.createEvent("Event");
    touchEvent.initEvent(type, canBubble, cancelable);
    utils.mixin(eventData, touchEvent);
    return touchEvent;
}

function _trapAndDisableSingleClickEvent(mouseevent) {
    mouseevent.preventDefault();
    mouseevent.stopPropagation();
    mouseevent.target.removeEventListener('click', _trapAndDisableSingleClickEvent, true);
}

function _isWithinAnchor(mouseevent) {
    var el = mouseevent.target;
    while (typeof(el) !== 'undefined' && el !== null &&
        el.tagName.toLowerCase() !== 'a' &&
        el.tagName.toLowerCase() !== 'body') {
        el = el.parentNode;
    }
    return el.tagName.toLowerCase() === 'a';
}

function _hasTextSelection(mouseevent) {
    var el = mouseevent.target,
        doc = el.ownerDocument,
        win = doc.defaultView,
        selection = win.getSelection(),
        range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    return range !== null && range.toString().length > 0;
}

function _raiseContextMenuEvent(mouseevent) {
    var formFieldTags = [
            'input',
            'select',
            'textarea'
        ],
        target = mouseevent.target,
        tagName = target.tagName.toLowerCase(),
        context = null,
        hasTextSelection = _hasTextSelection(mouseevent),
        isWithinAnchor = _isWithinAnchor(mouseevent);

    if (hasTextSelection) {
        context = 'TEXT';
    }
    else if (tagName === 'img' && isWithinAnchor) {
        context = 'IMAGE_LINK';
        mouseevent.target.addEventListener('click', _trapAndDisableSingleClickEvent, true);
    }
    else if (tagName === 'img') {
        context = 'IMAGE';
    }
    else if (isWithinAnchor) {
        context = 'LINK';
        mouseevent.target.addEventListener('click', _trapAndDisableSingleClickEvent, true);
    }
    else if (formFieldTags.indexOf(tagName) !== -1) {
        context = 'INPUT';
    }

    if (context !== null) {
        event.trigger('ContextMenuEvent', [context]);
    }
}

function _raiseTouchEvent(mouseevent) {
    var type = "",
        simulatedEvent,
        touchObj,
        eventData;

    switch (mouseevent.type) {
    case "mousedown":
        type = "touchstart";
        _isMouseDown = true;
        if (_longPressTimer !== null) {
            clearTimeout(_longPressTimer);
        }
        _longPressTimer = setTimeout(function () {
            _raiseContextMenuEvent(mouseevent);
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

function _marshalEvents(win, doc) {
    utils.forEach(["mousedown", "mousemove", "mouseup"],
        function (event) {
            doc.addEventListener(event, _raiseTouchEvent, true);
        });
    _doc = doc;
    _win = win;
    win.Node.prototype.ontouchstart = null;
    win.Node.prototype.ontouchend = null;
    win.Node.prototype.ontouchmove = null;
}

self = module.exports = {
    mask: function (win, doc, longPressDuration) {
        // optionally tweak the longPressDuration (to speed up unit tests)
        if (typeof(longPressDuration) !== 'undefined' &&
            parseInt(longPressDuration, 10) === longPressDuration) {
            _longPressDuration = longPressDuration;
        }
        _marshalEvents(win, doc);
    }
};
