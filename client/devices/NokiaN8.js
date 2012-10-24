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

    "id": "NokiaN8",
    "name": "Nokia N8",
    "model": "N8",
    "osName": "SymbianOS",
    "uuid": "42",
    "osVersion": "3",
    "manufacturer": "Nokia",

    "screen": {
        "width": 360,
        "height": 640
    },
    "viewPort": {
        "portrait": {
            "width": 360,
            "height": 640,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 640,
            "height": 360,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 209,
    "userAgent": "(Symbian/3; S60/5.2 Mozilla/5.0; NokiaN8-00/10.0.000; Profile/MIDP-2.1 Configuration/CLDC-1.1) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.2",
    "platforms": ["web", "cordova"],

    "notes": {
        "1": "<a href=\"http://www.forum.nokia.com/Devices/Device_specifications/N8-00/\" target=\"_blank\">Specs</a>"
    }
};
