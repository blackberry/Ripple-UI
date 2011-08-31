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
    db = require('ripple/db'),
    event = require('ripple/event');

function _omnibar() {
    return document.querySelector(".omni-bar input");
}

function _persist(url) {
    db.save("current-url", url);
}

event.on("FrameHistoryChange", function (url) {
    _omnibar().value = url;
    _persist(url);
});

module.exports = {
    initialize: function (prev, baton) {
        var omnibar = _omnibar(),
            back = document.getElementById("history-back"),
            forward = document.getElementById("history-forward"),
            reload = document.getElementById("history-reload");

        jQuery(".logo, .beta, .left, .right, .left-panel-collapse, .right-panel-collapse").css({
            "marginTop": "30px"
        });

        omnibar.value = db.retrieve("current-url") || "about:blank";

        omnibar.addEventListener("keydown", function (event) {
            if (event.keyCode === '13' || event.keyCode === 13) { // enter
                _persist(omnibar.value);
                emulatorBridge.window().location.assign(omnibar.value);
            }
        });

        back.addEventListener("click", function () {
            emulatorBridge.window().history.back();
        });

        forward.addEventListener("click", function () {
            emulatorBridge.window().history.forward();
        });

        reload.addEventListener("click", function () {
            emulatorBridge.window().location.reload();
        });
    }
};
