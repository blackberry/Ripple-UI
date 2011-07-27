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
    "id": "Legend",
    "name": "HTC Legend",
    "osName": "Android",
    "osVersion": "1.6",
    "manufacturer": "HTC",
    "model": "Legend",
    "uuid": "6F196F23-FD0D-4F62-B27B-730147FCC5A3",
    "firmware": "1.6",

    "screen": {
        "width": 320,
        "height": 480
    },
    "viewPort": {
        "portrait": {
            "width": 320,
            "height": 480,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 480,
            "height": 320,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "overrides": {
        "api": {
            "vodafone": {
                "viewPort": {
                    "portrait": {
                        "width": 320,
                        "height": 430,
                        "paddingTop": 50,
                        "paddingLeft": 0
                    },
                    "landscape": {
                        "width": 480,
                        "height": 270,
                        "paddingTop": 50,
                        "paddingLeft": 0
                    }
                }
            }
        }
    },

    "ppi": 180.3,
    "userAgent": "Mozilla/5.0 (Linux; U; Android 2.1; fr-fr; HTC Legend 1.32.163.1 Build/ERD79) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17",
    "browser": ["Webkit", "Presto"],
    "platforms": ["web", "wac", "phonegap", "vodafone"]
};
