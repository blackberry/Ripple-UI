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

    "id": "Bold9700",
    "name": "BlackBerry Bold 9700",
    "model": "9700",
    "osName": "BlackBerry OS",
    "uuid": "42",
    "osVersion": "6",
    "manufacturer": "Research In Motion",

    "skin": "Bold9700",

    "capabilities": [
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
        "width": 480,
        "height": 360
    },
    "viewPort": {
        "portrait": {
            "width": 480,
            "height": 360,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 245.00,
    "userAgent": "Mozilla/5.0 (BlackBerry; U; BlackBerry 9700; en) AppleWebKit/534.1+ (KHTML, Like Gecko) Version/6.0.0.141 Mobile Safari/534.1",
    "platforms": ["web", "phonegap", "webworks.handset", "cordova"]
};
