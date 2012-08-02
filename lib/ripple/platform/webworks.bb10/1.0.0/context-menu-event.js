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
var event = require('ripple/event');

function trapAndDisableSingleClickEvent(mouseevent) {
    mouseevent.preventDefault();
    mouseevent.stopPropagation();
    mouseevent.target.removeEventListener('click', trapAndDisableSingleClickEvent, true);
}

function isWithinAnchor(mouseevent) {
    var el = mouseevent.target;
    while (typeof(el) !== 'undefined' &&
        el !== null &&
        el.tagName.toLowerCase() !== 'a' &&
        el.tagName.toLowerCase() !== 'body') {
        el = el.parentNode;
    }
    return el.tagName.toLowerCase() === 'a';
}

function hasTextSelection(mouseevent) {
    var el = mouseevent.target,
        doc = el.ownerDocument,
        win = doc.defaultView,
        selection = win.getSelection(),
        range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    return range !== null && range.toString().length > 0;
}

function onWindowLongpress(mouseevent) {
    var context = null,
        formFieldTags = ['input', 'select', 'textarea'],
        target = mouseevent.target,
        tagName = target.tagName.toLowerCase(),
        isLink = isWithinAnchor(mouseevent);

    if (hasTextSelection(mouseevent)) {
        context = 'TEXT';
    } else if (tagName === 'img' && isLink) {
        context = 'IMAGE_LINK';
        mouseevent.target.addEventListener('click', trapAndDisableSingleClickEvent, true);
    } else if (tagName === 'img') {
        context = 'IMAGE';
    } else if (isLink) {
        context = 'LINK';
        mouseevent.target.addEventListener('click', trapAndDisableSingleClickEvent, true);
    } else if (formFieldTags.indexOf(tagName) !== -1) {
        context = 'INPUT';
    }

    if (context !== null) {
        event.trigger('ContextMenuEvent', [context], true);
    }
}

event.on('LongPressEvent', onWindowLongpress);
