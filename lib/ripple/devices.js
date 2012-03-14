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
    constants = require('ripple/constants'),
    event = require('ripple/event'),
    _devices = {};

event.on("HardwareKeyDefault", function (key) {
    if (key === 0 || key === "0") { //back button key
        require('ripple/emulatorBridge').window().history.back();
    }
});

_self = module.exports = {
    initialize: function () {
        _devices = [
            "Bold9700",
            "Bold9900",
            "Curve9300",
            "Curve9350-9360-9370",
            "FWVGA",
            "G1",
            "HPPre3",
            "HPVeer",
            "HVGA",
            "iPad",
            "iPhone3",
            "Legend",
            "Nexus",
            "NexusS",
            "NokiaN8",
            "NokiaN97",
            "PalmPre",
            "PalmPre2",
            "Pearl9100",
            "Playbook",
            "QVGA",
            "Style9670",
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
        return this.getDevice(db.retrieve(constants.DEVICE.SAVED_KEY));
    },

    getDevice: function (deviceId) {
        return _devices[deviceId] ? utils.copy(_devices[deviceId]) : null;
    },

    getDevicesForPlatform: function (platformId) {
        // TODO: select devices based on both platform and version
        return utils.filter(_devices, function (device) {
            return device.platforms.indexOf(platformId) > -1;
        });
    }
};
