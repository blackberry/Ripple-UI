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
    devices = require('ripple/devices'),
    platform = require('ripple/platform'),
    resizer = require('ripple/resizer'),
    tooltip = require('ripple/ui/plugins/tooltip'),
    db = require('ripple/db');

function _animateChangePlatformButton() {
    jQuery("#change-platform")
        .animate({opacity: 0.5}, 500)
        .animate({opacity: 1}, 500)
        .animate({opacity: 0.5}, 500)
        .animate({opacity: 1}, 500)
        .animate({opacity: 0.5}, 500)
        .animate({opacity: 1}, 500);
}

function _updatePlatformDeviceSelect(platformID, currentDeviceKey) {
    var deviceInfoArray = devices.getDevicesForPlatform(platformID),
        devicesSelect = document.getElementById(constants.COMMON.DEVICE_SELECT_ID),
        i, sortedDeviceInfoArray, deviceNode;

    devicesSelect.innerHTML = "";

    sortedDeviceInfoArray = deviceInfoArray.sort(function (a, b) {
        return a.name > b.name;
    });

    for (i = 0; i < sortedDeviceInfoArray.length; i += 1) {
        deviceNode = utils.createElement("option", {
            "innerText": sortedDeviceInfoArray[i].name,
            "value": sortedDeviceInfoArray[i].id
        });

        if (currentDeviceKey && deviceNode.value === currentDeviceKey) {
            deviceNode.selected = true;
        }

        devicesSelect.appendChild(deviceNode);
    }
}

module.exports = {
    panel: {
        domId: "platforms-container",
        collapsed: true,
        pane: "left"
    },
    initialize: function () {
        var currentPlatform = platform.current().id,
            currentVersion = platform.current().version,
            platformList = platform.getList(),
            platformSelect = document.getElementById(constants.COMMON.PLATFORM_SELECT_ID),
            versionSelect = document.getElementById("version-select"),
            currentDeviceKey = devices.getCurrentDevice().id,
            platformNode, versionNode;

        jQuery("#platform-select").bind("change", function () {
            var newPlatform = jQuery(this).val(),
                newDevice = jQuery("#device-select").val();

            jQuery(versionSelect).children("option").remove();

            utils.forEach(platformList, function (platform) {
                utils.forEach(platform, function (version, versionNumber) {
                    if (newPlatform === version.id) {
                        versionSelect.appendChild(utils.createElement("option", {
                            "innerText": versionNumber,
                            "value":  versionNumber
                        }));
                    }
                });
            });

            _updatePlatformDeviceSelect(newPlatform, newDevice);

            jQuery("#" + constants.COMMON.DEVICE_SELECT_ID).effect("highlight", {color: "#62B4C8"}, 500, function () {
                _animateChangePlatformButton();
            });
        });

        function changePlatformOrDevice() {
            var platformId = jQuery("#platform-select").val(),
                version = jQuery("#version-select").val(),
                device = jQuery("#device-select").val();

            platform.changeEnvironment({
                "name": platformId,
                "version": version
            }, device, function () {
                location.assign(location.href);
            });
        }

        jQuery("#change-platform").bind("click", changePlatformOrDevice);
        jQuery("#device-select").bind("change", changePlatformOrDevice);

        utils.forEach(platformList, function (platform) {
            utils.forEach(platform, function (version, versionNumber) {
                platformNode = utils.createElement("option", {
                    "innerText": version.name,
                    "value":  version.id
                });

                if (currentPlatform && version.id === currentPlatform) {
                    platformNode.selected = true;
                }

                if (currentVersion && currentVersion === versionNumber) {
                    versionNode = utils.createElement("option", {
                        "innerText": versionNumber,
                        "value":  versionNumber
                    });
                    versionNode.selected = true;
                    versionSelect.appendChild(versionNode);
                }

                platformSelect.appendChild(platformNode);
            });
        });

        _updatePlatformDeviceSelect(currentPlatform, currentDeviceKey);

        tooltip.create("#" +  constants.COMMON.CHANGE_PLATFORM_BUTTON_ID, "This action will reload your page.");
    }
};
