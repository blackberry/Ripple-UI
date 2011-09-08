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
var _self,
    db = require('ripple/db'),
    utils = require('ripple/utils'),
    exception = require('ripple/exception'),
    platform = require('ripple/platform'),
    constants = require('ripple/constants'),
    event = require('ripple/event'),
    _devices = {};

event.on("HardwareKeyDefault", function (key) {
    if (key === 0 || key === "0") { //back button key
        require('ripple/emulatorBridge').getWidgetWindow().history.back();
    }
});

function _currentID() {
    var deviceID = db.retrieve(constants.DEVICE.SAVED_KEY),
        currentDevice = _devices[deviceID] || null,
        currentPlatformId = platform.current().id;

    if (!currentDevice || !currentDevice.platforms.some(function (platformId) {
            return platformId === currentPlatformId;
        })) {
        deviceID = utils.reduce(_devices, function (current, device, id) {
            if (device.platforms.some(function (platformId) {
                return platformId === currentPlatformId;
            })) {
                current = id;
            }
            return current;
        });
    }

    return deviceID;
}

_self = module.exports = {
    initialize: function () {
        _devices = [
            "Bold9700",
            "Bold9900",
            "Curve9350-9360-9370",
            "FWVGA",
            "G1",
            "HPPre3",
            "HPVeer",
            "HVGA",
            "iPad",
            "iPhone3",
            "iPhone4",
            "Legend",
            "Nexus",
            "NexusS",
            "NokiaN8",
            "NokiaN97",
            "PalmPre",
            "PalmPre2",
            "Playbook",
            "QVGA",
            "Storm9550",
            "Tattoo",
            "Torch9800",
            "Torch9810",
            "Torch9860-9850",
            "Wave",
            "WQVGA",
            "WVGA"
        ].reduce(function (hash, deviceID) {
            hash[deviceID] = require('ripple/devices/' + deviceID);
            return hash;
        }, {});
    },

    getCurrentDevice: function () {
        return this.getDevice(_currentID(),
                              platform.current().id,
                              platform.current().version);
    },

    getDevice: function (deviceId, platform, version) {
        var device = _devices[deviceId] ? utils.copy(_devices[deviceId]) : null;

        if (device && platform && version) {
            if (device.overrides &&
                device.overrides.api &&
                device.overrides.api[platform]) {

                utils.forEach(device.overrides.api[platform], function (override, index) {
                    if (index !== "apiVersion") {
                        device[index] = override;
                    }
                });

                if (device.overrides.api[platform].apiVersion &&
                    device.overrides.api[platform].apiVersion[version]) {

                    utils.forEach(device.overrides.api[platform].apiVersion[version], function (override, index) {
                        device[index] = override;
                    });
                }
            }

            delete device.overrides;
        }

        return device;
    },

    getDevicesForPlatform: function (platformId) {
        //this doesn't do the overrides for the platform
        //but it currently doesn't need to because
        //this is just used for the list in the UI
        // TODO: select devices based on both platform and version
        return utils.filter(_devices, function (device) {
            return device.platforms.indexOf(platformId) > -1;
        });
    }
};
