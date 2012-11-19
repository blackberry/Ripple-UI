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
var event = ripple('event');

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
    return el.tagName.toLowerCase() === 'a' ? el : false;
}

function isWithinContextMenu(mouseevent) {
    var el = mouseevent.target;
    while (typeof(el) !== 'undefined' &&
        el !== null &&
        el.getAttribute &&
        el.getAttribute('id') !== 'contextMenu') {
        el = el.parentNode;
    }
    return el.getAttribute && el.getAttribute('id') === 'contextMenu';
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
    if (isWithinContextMenu(mouseevent)) {
        return;
    }

    var context = {name: null},
        formFieldTags = ['input', 'select', 'textarea'],
        target = mouseevent.target,
        tagName = target.tagName.toLowerCase(),
        linkElement = isWithinAnchor(mouseevent);

    if (hasTextSelection(mouseevent)) {
        context.name = 'TEXT';
    } else if (tagName === 'img' && linkElement) {
        context.name = 'IMAGE_LINK';
        mouseevent.target.addEventListener('click', trapAndDisableSingleClickEvent, true);
    } else if (tagName === 'img') {
        context.name = 'IMAGE';
    } else if (linkElement) {
        context.name = 'LINK';
        mouseevent.target.addEventListener('click', trapAndDisableSingleClickEvent, true);
    } else if (formFieldTags.indexOf(tagName) !== -1) {
        context.name = 'INPUT';
    }

    if (linkElement) {
        context.text = linkElement.textContent;
        context.url = linkElement.getAttribute('href') || '';
    }

    if (context.name !== null) {
        event.trigger('ContextMenuEvent', [context], true);
    }
}

event.on('LongPressEvent', onWindowLongpress);
