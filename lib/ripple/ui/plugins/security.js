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
    db = require('ripple/db');

function _saveAndReload(key, value) {
    jWorkflow.order(function (prev, baton) {
                baton.take();
                db.save(key, value, null, baton.pass);
            }).start(function () {
                        location.assign(location.href);
                    });
}

module.exports = {
    panel: {
        domId: "security-container",
        collapsed: true,
        pane: "right"
    },
    initialize: function () {
        var securityLevel = db.retrieve(constants.COMMON.SECURITY_LEVEL) || "trusted",
            select = jQuery("#security-level-select");

        select.val(securityLevel);

        select.change(function () {
            _saveAndReload(constants.COMMON.SECURITY_LEVEL, select.val());
        });
    }
};
