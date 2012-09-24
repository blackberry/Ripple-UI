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
    "transports": {
        "TCP Cellular": {
            "name": "Cellular TCP",
            "control": {
                "type": "checkbox",
                "value": true
            }
        },
        "Wap": {
            "name": "WAP",
            "control": {
                "type": "checkbox",
                "value": false
            }
        },
        "Wap 2.0": {
            "name": "WAP 2.0",
            "control": {
                "type": "checkbox",
                "value": false
            }
        },
        "MDS": {
            "name": "MDS",
            "control": {
                "type": "checkbox",
                "value": true
            }
        },
        "Bis B": {
            "name": "BIS B",
            "control": {
                "type": "checkbox",
                "value": true
            }
        },
        "Unite!": {
            "name": "Unite",
            "control": {
                "type": "checkbox",
                "value": false
            }
        },
        "TCP Wifi": {
            "name": "Wifi TCP",
            "control": {
                "type": "checkbox",
                "value": true
            }
        }
    },
    "identity": {
        "IMEI": {
            "name": "IMEI",
            "control": {
                "type": "text",
                "value": "123456786543210"
            }
        },
        "IMSI": {
            "name": "IMSI",
            "control": {
                "type": "text",
                "value": "310150123456789"
            }
        },
        "PIN": {
            "name": "PIN",
            "control": {
                "type": "text",
                "value": "43A8C489"
            }
        }
    },
    "system": {
        "isMassStorageActive": {
            "name": "Mass Storage Is Connected",
            "control": {
                "type": "checkbox",
                "value": true
            }
        },
        "hasDataCoverage": {
            "name": "Has Data Coverage",
            "control": {
                "type": "checkbox",
                "value": true
            },
            "callback": function (setting) {
                event.trigger("CoverageChange");
                require('ripple/bus').send("network", setting);
            }
        },
        "lag": {
            "name": "Lag the network",
            "control": {
                type: "checkbox",
                value: false
            },
            "callback": function (setting) {
                require('ripple/bus').send("lag", setting);
            }
        },
        "network": {
            "name": "Data Network",
            "control": {
                "type": "select",
                "value": "3GPP"
            },
            "options": {
                "3GPP" : "3GPP",
                "CDMA": "CDMA",
                "iDEN": "iDEN",
                "Wi-Fi": "Wi-Fi"
            },
            "callback": function () {
                event.trigger("CoverageChange");
            }
        }
    }
};
