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
    "id" : "Nexus7",
    "name": "Nexus 7 (Tablet)",
    "manufacturer": "Asus",
    "model": "Nexus 7 8/16 GB",
    "osName": "Android",
    "uuid" : "903802EA-1786-4175-B0F1-1FDF87813CAA",
    "osVersion": "4.x.x",

    "screen": {
        "width": 800,
        "height": 1280
    },
    "viewPort": {
        "portrait": {
            "width": 800,
            "height": 1280,
            "paddingTop": 0,
            "paddingLeft": 0
        },
        "landscape": {
            "width": 1280,
            "height": 800,
            "paddingTop": 0,
            "paddingLeft": 0
        }
    },

    "ppi": 215,
    "userAgent": "Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19",
    "platforms": ["web", "phonegap", "cordova"],

    "notes": {
        "1": "<a href=\"http://www.google.com/nexus/#/7/specs\" target=\"_blank\">Specs</a>"
    }

};
