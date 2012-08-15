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
    "id": "Nexus",
    "name": "Nexus One",
    "manufacturer": "HTC",
    "model": "Nexux One",
    "osName": "Android",
    "uuid": "6F196F23-FD0D-4F62-B27B-730147FCC5A3",
    "osVersion": "2.x.x",

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

    "ppi": 252.15,
    "userAgent": "Mozilla/5.0 (Linux; U; Android 2.1; en-us; Nexus One Build/ERD62) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17",
    "platforms": ["web", "cordova"],

    "notes": {
        "1": "<a href=\"http://www.google.com/phone/static/en_US-nexusone_tech_specs.html\" target=\"_blank\">Specs</a>"
    }
};
