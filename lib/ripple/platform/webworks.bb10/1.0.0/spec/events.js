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

// Blarg.. cyclic issue here.
// TODO: Fix, or (based on TODO below) when a proper keyboard panel is made, the events using this can be removed.
function keyboard() {
    return require('ripple/ui/plugins/virtualKeyboard');
}

module.exports = {
    "blackberry.event.swipedown": {
        callback: function () {
            event.trigger("AppSwipeDown");
        }
    },
    "blackberry.event.resume": {
        callback: function () {
            event.trigger("AppResume");
        }
    },
    "blackberry.event.pause": {
        callback: function () {
            event.trigger("AppPause");
        }
    },
    "blackberry.event.keyboardOpened": {
        callback: function () {
            event.trigger("KeyboardOpened");
        }
    },
    "blackberry.event.keyboardOpening": {
        callback: function () {
            event.trigger("KeyboardOpening");
        }
    },
    "blackberry.event.keyboardClosed": {
        callback: function () {
            event.trigger("KeyboardClosed");
        }
    },
    "blackberry.event.keyboardClosing": {
        callback: function () {
            event.trigger("KeyboardClosing");
        }
    },

    // TODO: These feel a bit hacked, but this felt best, until a solid keyboard panel UI can be made.
    "open virtual keyboard": {
        callback: function () {
            keyboard().open();
        }
    },
    "close virtual keyboard": {
        callback: function () {
            keyboard().close();
        }
    }
};
