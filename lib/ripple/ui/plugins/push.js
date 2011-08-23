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
var constants = require('ripple/constants'),
    event = require('ripple/event'),
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    PUSH_OPTIONS = constants.PUSH.OPTIONS;

function _updatePushPanel(ports) {
    var portsSelect = document.getElementById("port-select"),
        currentPort = portsSelect.value;

    portsSelect.innerHTML = "";

    ports.forEach(function (port) {
        portsSelect.appendChild(utils.createElement("option", {
            innerText: port,
            value: port,
            selected: currentPort === port
        }));
    });
}

module.exports = {
    panel: {
        domId: "push-container",
        collapsed: true,
        pane: "left"
    },
    initialize: function () {
        event.on("PushListenersChanged", function (listeners) {
            _updatePushPanel(listeners);
            jQuery("#port-select").effect("highlight", {color: "#62B4C8"}, 1000);
        });

        _updatePushPanel([]);

        document.getElementById("push-send")
            .addEventListener("click", function () {
                var port = document.getElementById("port-select").value,
                    text = document.getElementById(PUSH_OPTIONS.PAYLOAD).value,
                    pushData = {
                        headerField: ["21f39092"],
                        requestURI: "/",
                        source: "ripple",
                        isChannelEncrypted: false,
                        payload: text
                    };

                event.trigger("Push", [pushData, port], true);
            }, false);

        utils.bindAutoSaveEvent(jQuery("#" + PUSH_OPTIONS.PAYLOAD), function () {
            db.save(PUSH_OPTIONS.PAYLOAD, document.getElementById(PUSH_OPTIONS.PAYLOAD).value);
        });

        document.getElementById(PUSH_OPTIONS.PAYLOAD).value = db.retrieve(PUSH_OPTIONS.PAYLOAD) || "My payload data";
    }
};
