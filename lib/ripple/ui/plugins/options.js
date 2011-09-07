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
var wrench = document.getElementById('options-button'),
    about = require('ripple/ui/plugins/about-dialog'),
    settings = require('ripple/ui/plugins/settings-dialog'),
    hide,
    show;

show = function () {
    $("#options-window").show();
    $("#options-menu").show();
    wrench.onclick = hide;
};

hide = function () {
    $("#options-window").hide();
    $("#options-menu").effect("fade", {}, 300);
    wrench.onclick = show;
};

module.exports = {
    initialize: function () {
        $("#options-menu").menu().hide();
        $("#options-menu").bind("click", function (event) {
            var target = $("#" + event.target.parentElement.id),
                action = target.attr("id").split("-")[2];

            if (target.hasClass("not-ready")) {
                return;
            }

            switch (target.attr("id")) {
            case "options-menu-build":
            case "options-menu-launch":
            case "options-menu-sign":
                if (!settings.can(action)) {
                    settings.show(action);
                }
                else {
                    settings.perform(action);
                }
                break;
            case "options-menu-about":
                about.show();
                break;
            case "options-menu-settings":
                settings.show();
                break;
            default:
                break;
            }
            hide();
        });

        $("#options-window").click(hide);
        hide();
    }
};
