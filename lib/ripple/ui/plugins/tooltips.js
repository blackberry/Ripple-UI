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
// Class: UI.Tooltips
// Purpose: build tooltips for UI
// See here for Tooltip Options
// http://jquery.bassistance.de/tooltip/demo/
var utils = require('ripple/utils'),
    tooltip = require('ripple/ui/plugins/tooltip'),
    constants = require('ripple/constants'),
    db = require('ripple/db'),
    utils = require('ripple/utils');

function _updateButtonText() {
    document.querySelector("#settings-toggletooltips > span")
            .innerHTML = "Turn " + (tooltip.isOff() ? "On" : "Off");
}

module.exports = {
    initialize: function () {
        var saved = db.retrieve(constants.SETTINGS.TOOLTIPS_KEY);

        // blarg, tooltips are always enabled so if its saved to false disable it
        if (!tooltip.isOff() && (saved === "false" || saved === false)) {
            tooltip.toggle();
        }

        _updateButtonText();

        jQuery(constants.SETTINGS.TOOLTIPS_TOGGLE_DIV).click(function () {
            db.save(constants.SETTINGS.TOOLTIPS_KEY, !tooltip.toggle());
            _updateButtonText();
        });
    }
};
