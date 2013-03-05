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

    "id": "iPhone5",
    "name": "iPhone 5",
    "model": "5",
    "osName": "iOS",
    "osVersion": "6",
    "uuid": "e0101010d38bde8e6740011221af335301010333",
    "manufacturer": "Apple",

    "screen": {
        "width": 640,
        "height": 1136
    },
    "viewPort": {
        "portrait": {
            "width": 640,
            "height": 1136,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 1136,
            "height": 640,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 326,
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3",
    "platforms": ["web", "cordova"],
    "mediaQueryEmulation": {
        "-webkit-device-pixel-ratio": 2
    }
};
