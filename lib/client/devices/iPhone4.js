/*
 *  Copyright 2011 Research In Motion Limited.
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

    "id": "iPhone4",
    "name": "iPhone 4/4s",
    "model": "4s",
    "osName": "iOS",
    "osVersion": "5",
    "uuid": "e0101010d38bde8e6740011221af335301010333",
    "manufacturer": "Apple",

    "screen": {
        "width": 640,
        "height": 960
    },
    "viewPort": {
        "portrait": {
            "width": 640,
            "height": 960,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 960,
            "height": 640,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 326,
    "userAgent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/1A542a Safari/419.3",
    "platforms": ["web", "cordova", "Obigo-Mobile"],
    "mediaQueryEmulation": {
        "-webkit-device-pixel-ratio": 2
    }
};
