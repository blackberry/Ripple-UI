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

    "id": "Playbook",
    "name": "BlackBerry Playbook",
    "model": "100669958",
    "osName": "BlackBerry PlayBook OS",
    "uuid": "42",
    "osVersion": "BlackBerry PlayBook OS",
    "manufacturer": "Research In Motion",

    "skin": "Playbook",

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
        "width": 1024,
        "height": 600
    },
    "viewPort": {
        "portrait": {
            "width": 1024,
            "height": 600,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 600,
            "height": 1024,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "defaultOrientation": "landscape",

    "ppi": 169.55,
    "userAgent": "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML, like Gecko) Version/7.2.1.0 Safari/536.2+",
    "platforms": ["web", "webworks.tablet", "cordova"]
};
