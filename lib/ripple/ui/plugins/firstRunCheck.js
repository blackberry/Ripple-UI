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
    _platform = require('ripple/platform'),
    db = require('ripple/db');

function _handleFirstRunResponse(platform, version) {
    var device = jQuery("#device-select").val(),
        api = {
            name: platform.id,
            version: version
        };


    _platform.changeEnvironment(api, device, function () {
        window.tinyHipposReload = true;
        location.reload();
    });
}

function _addPlatformButton(platform, version) {
    var section = jQuery(".platform-select-buttons"),
        buttonID = "platform-" + platform.id,
        button = utils.createElement("button", {
            "id": buttonID,
            "class": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"
        });

    button.appendChild(utils.createElement("span", {
        "class": "ui-button-text",
        "innertext" : platform.name
    }));

    section.append(button);

    document.getElementById(buttonID).addEventListener("click", function () {
        _handleFirstRunResponse(platform, version);
    });
}

function _initializeFirstRunCheck() {
    var savedPlatform = db.retrieveObject("api-key"),
        firstRunOverlayNode, firstRunOptionsNode,
        width, p;

    if (!savedPlatform) {
        width = jQuery(document).width();
        p = (width / 2) - 277;

        firstRunOverlayNode = jQuery(".first-run-window").css({display: 'block'});
        firstRunOptionsNode = jQuery(".platform-select-dialog").css({display: 'block', left: p + "px"});

        utils.forEach(_platform.getList(), function (platform) {
            utils.forEach(platform, function (details, version) {
                _addPlatformButton(details, version);
            });
        });
    }
}

module.exports = {
    initialize: function () {
        if (utils.map(_platform.getList(), function (platform) {
            return platform;
        }).length > 1) {
            _initializeFirstRunCheck();
        }
    }
};
