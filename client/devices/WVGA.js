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
    "id": "WVGA",
    "name": "Generic - WVGA (480x800)",
    "osName": "Generic",
    "osVersion": "Generic",
    "manufacturer": "Generic",
    "model": "Generic",
    "uuid": "42",

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

    "ppi": 96,
    "platforms": ["web", "cordova"],
    "userAgent": "Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.7 Safari/533.2"
};
