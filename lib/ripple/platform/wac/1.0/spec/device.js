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
    event = require('ripple/event');

module.exports = {
    "AccountInfo": {
        "phoneUserUniqueId": {
            "name": "User Unique Id",
            "control": {
                "type": "text",
                "value": new Date().getTime().toString()
            }
        },
        "phoneMSISDN":  {
            "name": "MSISDN",
            "control": {
                "type": "text",
                "value": "15199999999"
            }
        },
        "phoneOperatorName":  {
            "name": "Operator Name",
            "control": {
                "type": "text",
                "value": ""
            }
        },
        "userAccountBalance":  {
            "name": "Account Balance",
            "control": {
                "type": "number",
                "value": 0
            }
        },
        "userSubscriptionType":  {
            "name": "Subscription Type",
            "control": {
                "type": "select",
                "value": "other"
            },
            "options": {
                "other": "other",
                "prepaid": "prepaid",
                "postpaid": "postpaid"
            }
        }
    },
    "RadioInfo": {
        "isRoaming": {
            "name": "Is Roaming",
            "control": {
                "type": "checkbox",
                "value": false
            },
            "callback": function () {
                event.trigger("RadioSignalSourceChanged");
            }
        },
        "isRadioEnabled":  {
            "name": "Is Radio Enabled",
            "control": {
                "type": "checkbox",
                "value": true
            }
        },
        "radioSignalSource": {
            "name": "Radio Signal Source",
            "control": {
                "type": "select",
                "value": "GSM"
            },
            // TODO: try not to duplicate from RadioSignalSourceTypes
            "options": {
                "CDMA": "cdma",
                "GSM": "gsm",
                "LTE": "lte",
                "TDSCDMA": "tdscdma",
                "WCDMA": "wcdma"
            },
            "callback": function () {
                event.trigger("RadioSignalSourceChanged");
            }
        },
        "radioSignalStrengthPercent": {
            "name": "Signal Strength %",
            "control": {
                "type": "select",
                "value": 80
            },
            "options": (function () {
                var i,
                    optionList = {};

                for (i = 0; i <= 100; i++) {
                    optionList[i] = i;
                }

                return optionList;
            }())
        }
    },
    "Config": {
        "ringtoneVolume": {
            "name": "Ringtone Volume",
            "control": {
                "type": "select",
                "value": 10
            },
            "options": (function () {
                var i,
                    optionList = {};

                for (i = 0; i <= 10; i++) {
                    optionList[i] = i;
                }

                return optionList;
            }())
        },
        "msgRingtoneVolume":  {
            "name": "Msg Ringtone Volume",
            "control": {
                "type": "select",
                "value": 10
            },
            "options": (function () {
                var i,
                    optionList = {};

                for (i = 0; i <= 10; i++) {
                    optionList[i] = i;
                }

                return optionList;
            }())
        },
        "vibrationSetting":  {
            "name": "Vibration",
            "control": {
                "type": "select",
                "value": "off"
            },
            "options": {
                "on": "ON",
                "off": "OFF"
            }
        }
    },
    "Account": {
        "accountName":  {
            "name": "Name",
            "control": {
                "type": "text",
                "value": ""
            }
        },
        "accountId":  {
            "name": "Id",
            "control": {
                "type": "text",
                "value": ""
            }
        }
    },
    "DeviceInfo": {
        "totalMemory": {
            "name": "Total Memory",
            "control": {
                "type": "range",
                "value": 262144,
                "min": 0,
                "max": 4096000
            }
        },
        "phoneColorDepthDefault": {
            "name": "Color Depth",
            "control": {
                "type": "number",
                "value": 24
            }
        }
    },
    "DeviceStateInfo": {
        "availableMemory": {
            "name": "Available Memory",
            "control": {
                "type": "range",
                "value": 262144,
                "min": 0,
                "max": 4096000
            }
        },
        "keypadLightOn":   {
            "name": "Keypad Light On",
            "control": {
                "type": "checkbox",
                "value": false
            }
        },
        "backLightOn": {
            "name": "Back Light On",
            "control": {
                "type": "checkbox",
                "value": false
            }
        },
        "audioPath":  {
            "name": "Audio Path",
            "control": {
                "type": "select",
                "value": "receiver"
            },
            "options": {
                "speaker": "speaker",
                "receiver": "receiver",
                "earphone": "earphone"
            }
        },
        "processorUtilizationPercent":  {
            "name": "CPU Utilization %",
            "control": {
                "type": "select",
                "value": "5"
            },
            "options": (function () {
                var i,
                    optionList = {};

                for (i = 0; i <= 100; i++) {
                    optionList[i] = i;
                }

                return optionList;
            }())
        },
        "language":  {
            "name": "Language",
            "control": {
                "type": "select",
                "value": "eng"
            },
            "options": (function () {
                var i,
                    optionList = {},
                    iterator = constants.LANG.ISO6392_LIST;

                for (i = 0; i <= iterator.length; i++) {
                    optionList[iterator[i]] = iterator[i];
                }

                return optionList;
            }())
        }
    },
    "DataNetworkInfo": {
        "isDataNetworkConnected": {
            "name": "Data Network Is Connected",
            "control": {
                "type": "checkbox",
                "value": true
            }
        },
        "networkConnectionType": {
            "name": "Network Connection Type",
            "control": {
                "type": "select",
                "value": ["GPRS"]
            },
            // TODO: try not to duplicate from DataNetworkConnectionTypes
            "options": {
                "BLUETOOTH": "bluetooth",
                "EDGE": "edge",
                "EVDO": "evdo",
                "GPRS": "gprs",
                "IRDA": "irda",
                "LTE": "lte",
                "ONEXRTT": "1xrtt",
                "WIFI": "wifi"
            },
            "callback": function (setting) {
                event.trigger("DataNetworkConnectionChanged", [setting]);
            }
        }
    },
    "PowerInfo": {
        "isCharging": {
            "name": "Battery Is Charging",
            "control": {
                "type": "checkbox",
                "value": true
            },
            "callback": function (setting) {
                event.trigger("DeviceBatteryStateChanged", [setting]);
            }
        },
        "percentRemaining":  {
            "name": "Battery Remaining %",
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
