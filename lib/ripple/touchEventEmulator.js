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
    self;

// NOTE: missing view, detail, touches, targetTouches, scale and rotation
function _initTouchEvent(type, canBubble, cancelable, eventData) {
    var touchEvent = _doc.createEvent("Event");
    touchEvent.initEvent(type, canBubble, cancelable);
    utils.mixin(eventData, touchEvent);
    return touchEvent;
}

function _trapAndDisableSingleClickEvent (e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.removeEventListener('click', _trapAndDisableSingleClickEvent, true);
}

function _isWithinAnchor (e) {
    el = e.target;
    while (typeof(el) !== 'undefined' && el !== null &&
        el.tagName.toLowerCase() !== 'a' &&
        el.tagName.toLowerCase() !== 'body') {
        el = el.parentNode;
    }
    return el.tagName.toLowerCase() == 'a';
}

function _raiseContextMenuEvent(mouseEvent) {
    var formFieldTags = [
            'input',
            'select',
            'textarea'
        ],
        target = mouseEvent.target,
        tagName = target.tagName.toLowerCase(),
        parentTagName = target.parentNode.tagName.toLowerCase(),
        context = null,
        selection = _doc.getSelection(),
        selectionRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null,
        hasSelection = selectionRange !== null && selectionRange.toString().length > 0,
        isWithinAnchor = _isWithinAnchor(mouseEvent);

    if (hasSelection) {
        context = 'TEXT';
    }
    else if (tagName === 'img' && isWithinAnchor) {
        context = 'IMAGE_LINK';
        mouseEvent.target.addEventListener('click', _trapAndDisableSingleClickEvent, true);
    }
    else if (tagName === 'img') {
        context = 'IMAGE';
    }
    else if (isWithinAnchor) {
        context = 'LINK';
        mouseEvent.target.addEventListener('click', _trapAndDisableSingleClickEvent, true);
    }
    else if (formFieldTags.indexOf(tagName) !== -1) {
        context = 'INPUT';
    }

    if (context !== null) {
        event.trigger('ContextMenuEvent', [context]);
    }
}

function _raiseTouchEvent(mouseEvent) {
    var type = "",
        simulatedEvent,
        touchObj,
        eventData;

    switch (mouseEvent.type) {
    case "mousedown":
        type = "touchstart";
        _isMouseDown = true;
        if (_longPressTimer !== null) {
            clearTimeout(_longPressTimer);
        }
        _longPressTimer = setTimeout(function () {
            _raiseContextMenuEvent(mouseEvent);
        }, 800);
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
    mask: function (win, doc) {
        _marshalEvents(win, doc);
    }
};
