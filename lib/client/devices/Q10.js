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

    "id": "Q10",
    "name": "BlackBerry Q10",
    "model": "",
    "osName": "",
    "uuid": "42",
    "osVersion": "10.1",
    "manufacturer": "BlackBerry",
    "hardwareId": "0x8400270a",

    "skin": "Q10",

    "capabilities": [
        "input.touch",
        "location.gps",
        "media.audio.capture",
        "media.video.capture",
        "media.recording",
        "network.bluetooth",
        "network.wlan"
    ],

    "screen": {
        "width": 720,
        "height": 720
    },
    "viewPort": {
        "portrait": {
            "width": 720,
            "height": 720,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "defaultOrientation": "portrait",

    "ppi": 330,
    "userAgent": "",
    "platforms": ["web", "webworks.bb10", "cordova"],
    "mediaQueryEmulation": {
        "-webkit-device-pixel-ratio": 2.08
    }
};
