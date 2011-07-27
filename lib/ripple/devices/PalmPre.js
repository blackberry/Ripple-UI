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
    "id": "PalmPre",
    "name": "Palm Pre",
    "manufacturer": "Palm",
    "model": "Pre",
    "firmware": "1.x",
    "osName": "WebOS",
    "osVersion": "1.x",

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

    "ppi": 186.09,
    "userAgent": "Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1 (KHTML, like Gecko) Version/1.0 Safari/525.27.1 Pre/1.0",
    "browser": ["Webkit"],
    "platforms": ["web", "phonegap"],

    "notes": {
        "1": "<a href=\"http://www.palm.com/us/products/phones/pre/#tab2\" target=\"_blank\">Specs</a>"
    }
};
