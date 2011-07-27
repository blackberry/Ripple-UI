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
    "id" : "NexusS",
    "name": "Nexus S",
    "manufacturer": "Samsung",
    "model": "Nexux S",
    "firmware": "2.3.x",
    "osName": "Android",
    "uuid" : "F54E13F1-C1B7-4212-BFA8-AB3C9C3F088F",
    "osVersion": "2.3.x",

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

    "ppi": 235,
    "userAgent": "Mozilla/5.0 (Linux; U; Android 2.3.2; en-us; Nexus S Build/GRH78C) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "browser": ["Webkit", "Presto"],
    "platforms": ["web", "phonegap"],

    "notes": {
        "1": "<a href=\"http://www.google.com/nexus/#/tech-specs\" target=\"_blank\">Specs</a>"
    }

};
