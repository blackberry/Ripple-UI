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

    "id": "iPad3",
    "name": "the New iPad",
    "model": "the New iPad",
    "osName": "iOS",
    "uuid": "34",
    "osVersion": "5.1",
    "firmware": "5.1",
    "manufacturer": "Apple",

    "screen": {
        "width": 1536,
        "height": 2048
    },
    "viewPort": {
        "portrait": {
            "width": 1536,
            "height": 2048,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 2048,
            "height": 1536,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 264,
    "userAgent": "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10",
    "browser": ["Webkit"],
    "platforms": ["web", "phonegap", "cordova"],

    "notes": {
        "1": "<a href=\"http://www.apple.com/ipad/specs/\" target=\"_blank\">Specs</a>"
    }
};
