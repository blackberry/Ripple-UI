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
var utils = require('ripple/utils'),
    db = require('ripple/db'),
    THEME_KEY = "ui-theme",
    THEME_SELECTOR = "#theme-select",
    _currentTheme;

function _saveAndReload(key, value) {
    jWorkflow.order(function (prev, baton) {
                baton.take();
                db.save(key, value, null, baton.pass);
            }).start(function () {
                        location.assign(location.href);
                    });
}

module.exports = {
    initialize: function () {
        var node = jQuery(THEME_SELECTOR),
            themeToSet = db.retrieve(THEME_KEY),
            themes = require('ripple/ui/themes');

        if (themeToSet && !utils.some(themes, function (some, index) {
            return themes[index] === themeToSet;
        })) {
            _saveAndReload(THEME_KEY, themes[0]);
        } else {
            utils.forEach(themes, function (theme) {
                node.append(utils.createElement("option", {
                    "value": theme,
                    "innerHTML": theme
                }));
            });

            if (themes.length > 1) {
                node.val(themeToSet);
                node.bind("change", function () {
                    _currentTheme = node.val();
                    _saveAndReload(THEME_KEY, _currentTheme);
                });
            } else {
                jQuery(".theme-switcher").hide();
            }
        }
    }
};
