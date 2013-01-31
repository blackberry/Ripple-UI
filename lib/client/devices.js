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
    db = ripple('db'),
    utils = ripple('utils'),
    platform = ripple('platform'),
    event = ripple('event'),
    _devices = {};

event.on("HardwareKeyDefault", function (key) {
    if (key === 0 || key === "0") { //back button key
        ripple('emulatorBridge').window().history.back();
    }
});

_self = module.exports = {
    initialize: function () {
        _devices = [
            "AcerA500",
            "Bold9700",
            "Bold9900",
            "Q10",
            "Z10",
            "Curve9300",
            "Curve9350-9360-9370",
            "FWVGA",
            "G1",
            "HPPre3",
            "HPVeer",
            "HVGA",
            "iPad",
            "iPad3",
            "iPhone3",
            "iPhone4",
            "Legend",
            "Nexus",
            "NexusS",
            "NexusGalaxy",
            "Nexus7",
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
            hash[deviceID] = ripple('devices/' + deviceID);
            return hash;
        }, {});

        var current = this.getCurrentDevice();
        ripple('bus').send('userAgent', current.userAgent);
    },

    getCurrentDevice: function () {
        var deviceId = db.retrieve("device-key"),
            device = this.getDevice(deviceId),
            platformId = platform.current().id,
            does = function (device) {
                return {
                    include: function (platformId) {
                        return device.platforms.some(function (id) {
                            return platformId === id;
                        });
                    }
                };
            };

        if (!device || !does(device).include(platformId)) {
            deviceId = utils.reduce(_devices, function (current, device, id) {
                return does(device).include(platformId) ? id : current;
            });

            device = this.getDevice(deviceId);
        }

        return device;
    },

    getDevice: function (deviceId) {
        return _devices[deviceId] ? utils.copy(_devices[deviceId]) : null;
    },

    getDevicesForPlatform: function (platformId) {
        return utils.filter(_devices, function (device) {
            return device.platforms.indexOf(platformId) > -1;
        });
    }
};
