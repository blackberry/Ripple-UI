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
var notifications = require('ripple/notifications'),
    constants = require('ripple/constants'),
    type = constants.NOTIFICATIONS.TYPES.NORMAL,
    name = {
        "0": "Address Book",
        "1": "Bluetooth Config",
        "2": "Calculator",
        "3": "Calendar",
        "4": "Camera",
        "map://": "Maps",
        "6": "Memopad",
        "7": "Messages",
        "8": "Phone",
        "9": "Search",
        "10": "Tasks",
        "http://": "Browser",
        "12": "Java",
    };

module.exports = {
    invoke: function (opts) {
        notifications.openNotification(type,
           "Application requested to launch: " + name[opts.appType]);
        return {code: 1};
    }
};
