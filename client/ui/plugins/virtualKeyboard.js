/*
 *  Copyright 2012 Research In Motion Limited.
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
var event = require('ripple/client/event'),
    ui = require('ripple/client/ui'),
    $ = window.jQuery,
    _isAnimating,
    _MAX_HEIGHT = "40%",
    _OVERLAY_VIEWS = "#overlay-views",
    _KEYBOARD = ".virtual-keyboard-container",
    _KEYBOARD_OVERLAY = ".virtual-keyboard-overlay",
    _KEYBOARD_OVERLAY_WINDOW = "virtual-keyboard-window";

function emit(evt, args) {
    event.trigger(evt, args, true);
}

function keyboardIsClosed() {
    return computedHeight($(_KEYBOARD)[0]) === 0;
}

function computedHeight(domElement) {
    return parseInt(window.getComputedStyle(domElement).height, 10);
}

function distanceFromOverlayTop(elem) {
    return computedHeight($(_KEYBOARD_OVERLAY)[0]) - computedHeight(elem);
}

function animate(opts) {
    if (_isAnimating) { return; }
    _isAnimating = true;
    $(_KEYBOARD).animate({height: opts.height}, {
        complete: function () {
            _isAnimating = false;
            opts.complete();
        },
        step: function (now, fx) {
            emit("KeyboardPosition", [distanceFromOverlayTop(fx.elem)]);
        }
    });
}

function open() {
    if (_isAnimating || !keyboardIsClosed()) { return; }
    ui.showOverlay(_KEYBOARD_OVERLAY_WINDOW, null, true);
    $(_OVERLAY_VIEWS).css({width: "inherit", height: "inherit", position: "absolute"});
    emit("KeyboardOpening");
    animate({
        height: _MAX_HEIGHT,
        complete: emit.bind(this, "KeyboardOpened")
    });
}

function close() {
    if (_isAnimating || keyboardIsClosed()) { return; }
    emit("KeyboardClosing");
    animate({
        height: "0",
        complete: function () {
            emit("KeyboardClosed");
            ui.hideOverlay(_KEYBOARD_OVERLAY_WINDOW);
            $(_OVERLAY_VIEWS).css({width: "auto", height: "auto", position: "inherit"});
        }
    });
}

function noop() {}

module.exports = {
    initialize: noop,
    open: open,
    close: close
};
