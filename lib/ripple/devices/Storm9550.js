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

    "id": "Storm9550",
    "name": "Blackberry Storm 9550",
    "model": "9550",
    "osName": "Blackberry OS",
    "uuid": "42",
    "osVersion": "5",
    "firmware": "5",
    "manufacturer": "Research In Motion",

    "skin": "Storm9550",

    "capabilities": [
        "input.touch",
        "location.gps",
        "location.maps",
        "media.audio.capture",
        "media.video.capture",
        "media.recording",
        "storage.memorycard",
        "network.bluetooth",
        "network.wlan",
        "network.3gpp"
    ],

    "screen": {
        "width": 360,
        "height": 480
    },
    "viewPort": {
        "portrait": {
            "width": 360,
            "height": 480,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 480,
            "height": 360,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 185,
    "userAgent": "BlackBerry9550/5.0.0.287 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/105",
    "browser": ["BlackBerry Browser"],
    "platforms": ["web", "phonegap", "webworks.handset"]
};
