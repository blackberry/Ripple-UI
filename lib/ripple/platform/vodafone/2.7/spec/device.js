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
        "phoneOperatorName":  {
            "name": "Operator Name",
            "control": {
                "type": "text",
                "value": ""
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
        }
    },
    "DeviceInfo": {
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

                for (i = 0; i <= iterator.length - 1; i++) {
                    optionList[i] = iterator[i];
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
            },
            "callback": function (setting) {
                event.trigger("isDataNetworkConnectedChanged", [setting]);
            }
        }
    }
};
