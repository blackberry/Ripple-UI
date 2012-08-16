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
var db = require('ripple/db'),
    constants = require('ripple/constants'),
    KEY = constants.XHR.PROXY_DISABLED_BUTTON; // TODO: one settings object for all

function _saveAndReload(key, value) {
    jWorkflow.order(function (prev, baton) {
        baton.take();
        db.save(key, value, null, baton.pass);
    }).start(function () {
        window.tinyHipposReload = true;
        location.reload();
    });
}

function _initialize(prev, baton) {
    var select = document.getElementById("settings-xhr-proxy"),
        about = require('ripple/ui/plugins/about-dialog');

    select.value = String(db.retrieve(KEY));
    select.addEventListener("change", function () {
        _saveAndReload(KEY, this.value);
    }, false);

    $("#options-menu-about").click(function () {
        about.show();
    });
    // TODO: reload here?
}

module.exports = {
    panel: {
        domId: "settings-container",
        collapsed: true,
        pane: "right"
    },
    initialize: _initialize
};
