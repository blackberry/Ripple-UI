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

    "id": "iPad",
    "name": "iPad",
    "model": "iPad",
    "osName": "iOS",
    "uuid": "e0101010d38bde8e6740011221af335301010333",
    "osVersion": "1.6",
    "manufacturer": "Apple",

    "screen": {
        "width": 768,
        "height": 1024
    },
    "viewPort": {
        "portrait": {
            "width": 768,
            "height": 1024,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 1024,
            "height": 768,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 132,
    "userAgent": "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10",
    "platforms": ["web", "phonegap", "cordova"],

    "notes": {
        "1": "<a href=\"http://www.apple.com/ipad/specs/\" target=\"_blank\">Specs</a>"
    }
};
