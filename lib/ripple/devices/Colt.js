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

    "id": "Colt",
    "name": "BlackBerry Colt",
    "model": "Colt",
    "osName": "BlackBerry Tablet OS (QNX)",
    "uuid": "42",
    "osVersion": "QNX",
    "firmware": "6",
    "manufacturer": "Research In Motion",

    "skin": "Colt",

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
        "width": 768,
        "height": 1280
    },
    "viewPort": {
        "portrait": {
            "width": 768,
            "height": 1280,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 1280,
            "height": 768,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "defaultOrientation": "portrait",

    "ppi": 169.55,
    "userAgent": "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/0.0.1 Safari/534.8+.",
    "browser": ["Webkit"],
    "platforms": ["web", "webworks.bb10"]
};
