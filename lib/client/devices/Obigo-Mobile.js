/*
 *  Copyright 2013 Obigo.
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

    "id": "Obigo-Mobile",
    "name": "Obigo Web Platform Mobile",
    "manufacturer": "default",

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
    ],

    "screen": {
        "width": 480,
        "height": 800
    },
    "viewPort": {
        "portrait": {
            "width": 480,
            "height": 800,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 800,
            "height": 480,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "defaultOrientation": "portrait",

    "ppi": 253,
    "userAgent": "",
    "platforms": ["web", "Obigo-Mobile"]
};
