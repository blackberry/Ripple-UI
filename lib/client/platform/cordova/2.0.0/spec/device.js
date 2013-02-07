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
module.exports = {
    "NetworkStatus": {
        "connectionType": {
            "name": "Connection Type",
            "control": {
                "type": "select",
                "value": "ethernet"
            },
            "options": {
                "unknown": "UNKNOWN",
                "ethernet": "ETHERNET",
                "wifi": "WIFI",
                "2g": "CELL_2G",
                "3g": "CELL_3G",
                "4g": "CELL_4G",
                "none": "none"
            },
            "callback": function (setting) {
                var win = ripple('emulatorBridge').window(),
                    _console = ripple('console'),
                    connected = setting !== "none",
                    eventName = connected ? "online" : "offline";

                if (win && win.cordova) {
                    win.cordova.fireDocumentEvent(eventName);
                    _console.log("fired event ==> " + eventName);
                }

                ripple('bus').send("network", connected);
            }
        },
        "lag": {
            "name": "Lag the network",
            "control": {
                type: "checkbox",
                value: false
            },
            "callback": function (setting) {
                ripple('bus').send("lag", setting);
            }
        }
    },
    "globalization": {
        "locale": {
            "name": "locale name",
            "control": {
                "type": "select",
                "value": "en"
            },
            "options": {
                "en": "English",
                "en-ca": "English (Canadian)",
                "fr": "French",
                "fr-ca": "French (Canadian)",
                "de": "German"
            },
            "callback": function (setting) {
                moment.lang(setting);
            }
        },
        "isDayLightSavingsTime": {
            "name": "Is DayLight saves time",
            "control": {
                "type": "checkbox",
                value: false
            }
        },
        "firstDayOfWeek": {
            "name": "First Day of the week",
            "control": {
                "type": "select",
                "value": "1"
            },
            "options": {
                "1": "Sunday",
                "2": "Monday",
                "3": "Tuesday",
                "4": "Wednesday",
                "5": "Thursday",
                "6": "Friday",
                "7": "Saturday"
            },
        }
    }
};
