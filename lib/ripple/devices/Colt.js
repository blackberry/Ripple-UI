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
    "name": "BlackBerry 10 Dev Alpha",
    "model": "Colt",
    "osName": "BlackBerry",
    "uuid": "42",
    "osVersion": "10",
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

    "ppi": 355,
    "userAgent": "Mozilla/5.0 (BlackBerry) AppleWebKit/536.2+ (KHTML, like Gecko) Version/10.0.4.182 Mobile Safari/536.2+",
    "browser": ["Webkit"],
    "platforms": ["web", "webworks.bb10"]
};
