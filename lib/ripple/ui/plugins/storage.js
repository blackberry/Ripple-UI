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
    platform = require('ripple/platform'),
    utils = require('ripple/utils'),
    app = require('ripple/app'),
    db = require('ripple/db');

function _updatePreferencesView() {
    var node = document.getElementById(constants.COMMON.STORAGE_TABLE_BODY_CLASS),
        countTitle = document.getElementById(constants.COMMON.STORAGE_COUNT_CONTAINER_ID);

    // TODO: convert to appendChild
    if (node) {
        db.retrieveAll(platform.getPersistencePrefix(), function (results) {
            var str = "",
                counter = 0;

            utils.forEach(results, function (value, key) {
                // TODO: based of current platform
                if (app.isPreferenceReadOnly(key)) {
                    str += '<tr class="ui-text-highlight">';
                } else {
                    str += '<tr>';
                }
                str += '<td>' + key + '</td><td>' + value + "</td></tr>";
                counter ++;
            });

            node.innerHTML = str;
            countTitle.innerHTML = counter.toString();

            if (counter === 0) {
                jQuery("#" + constants.COMMON.STORAGE_CLEAR_BUTTON_ID).addClass(constants.CSS_PREFIX.IRRELEVANT);
            }
            else {
                jQuery("#" + constants.COMMON.STORAGE_CLEAR_BUTTON_ID).removeClass(constants.CSS_PREFIX.IRRELEVANT);
            }
        });
    }
}

module.exports = {
    panel: {
        domId: "preferences",
        collapsed: true,
        pane: "left"
    },
    initialize: function () {
        jQuery("#preferences-clear-button").bind("click", function () {
            db.removeAll(platform.getPersistencePrefix());
        });

        event.on("StorageUpdatedEvent", function () {
            _updatePreferencesView();
        });

        _updatePreferencesView();
    }
};
