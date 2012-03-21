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

var _send = document.getElementById("bus-send"),
    _receive = document.getElementById("bus-receive"),
    _evt = document.createEvent("Events");

_evt.initEvent('bus-init', true, true);
document.dispatchEvent(_evt);

module.exports = {
    send: function (msg, data) {
        var m = document.createElement("span");
        m.id = msg;
        m.innerHTML = data;
        _send.appendChild(m);
    },

    receive: function (handler) {
        if (!handler) {
            return;
        }

        _receive.addEventListener("DOMNodeInserted", function () {
            handler(this.target.id, this.target.innerHTML);
        });
    }
};
