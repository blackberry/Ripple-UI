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
var event = require('ripple/event');

module.exports = {
    "NetworkStatus": {
        "connectionType": {
            "name": "Connection Type",
            "control": {
                "type": "select",
                "value": "ethernet"
            },
            "options": {
                "0": "UNKNOWN",
                "1": "ETHERNET",
                "2": "WIFI",
                "3": "BLUETOOTH_DUN",
                "4": "USB",
                "5": "VPN",
                "6": "BB",
                "7": "CELLULAR",
                "8": "NONE"
            },
            "callback": function (setting, oldSetting) {
                event.trigger("DeviceConnectionChanged", [{oldType: parseInt(oldSetting, 10), newType: parseInt(setting, 10)}]);
            }
        }
    },
    "identity": {
        "uuid": {
            "name": "uuid",
            "control": {
                "type": "text",
                "value": "43A8C489"
            }
        }
    },
    "battery": {
        "state": {
            "name": "Handset is Charging",
            "control": {
                "type": "checkbox",
                "value": true
            },
            "callback": function (setting) {
                event.trigger("DeviceBatteryStateChanged", [setting]);
            }
        },
        "level":  {
            "name": "Charge Level (% remaining)",
            "control": {
                "type": "select",
                "value": 100
            },
            "options": (function () {
                var i,
                    optionList = {};

                for (i = 0; i <= 100; i++) {
                    optionList[i] = i;
                }

                return optionList;
            }()),
            "callback": function (setting) {
                event.trigger("DeviceBatteryLevelChanged", [setting]);
            }
        }
    }
};
