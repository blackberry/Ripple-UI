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
    "id": "XperiaX10",
    "name": "Sony Ericsson - Xperia X10",
    "manufacturer": "Sony",
    "model": "Xperia",
    "firmware": "n/a",
    "osName": "Android",
    "uuid": "6F196F23-FD0D-4F62-B27B-730147FCC5A3",
    "osVersion": "1.6",

    "screen": {
        "width": 480,
        "height": 854
    },
    "viewPort": {
        "portrait": {
            "width": 480,
            "height": 854,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 854,
            "height": 480,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "overrides": {
        "api": {
            "vodafone": {
                "viewPort": {
                    "portrait": {
                        "width": 480,
                        "height": 787,
                        "paddingTop": 67,
                        "paddingLeft": 0
                    },
                    "landscape": {
                        "width": 854,
                        "height": 413,
                        "paddingTop": 67,
                        "paddingLeft": 0
                    }
                }
            }
        }
    },

    "ppi": 245,
    "userAgent": "?",
    "browser": ["Webkit"],
    "platforms": ["web", "wac", "vodafone"]
};
