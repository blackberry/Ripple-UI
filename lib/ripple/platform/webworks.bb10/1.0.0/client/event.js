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

var event = require('ripple/event'),
    settings = require('ripple/deviceSettings'),
    callbacks = {
        batterystatus: [],
        batterylow: [],
        batterycritical: [],
        resume: [],
        pause: []
    };

function _apply(eventName, args) {
    callbacks[eventName].forEach(function (cb) {
        cb.apply(null, args);
    });
}

event.on("DeviceBatteryStateChanged", function (charging) {
    var info = {
        isPlugged: charging,
        level: settings.retrieve("battery.level")
    };

    _apply("batterystatus", [info]);
});

event.on("DeviceBatteryLevelChanged", function (level) {
    var info = {
        isPlugged: settings.retrieve("battery.state"),
        level: level
    };

    _apply("batterystatus", [info]);
    
    if (level === 14) {
        _apply("batterylow", [info]);
    }

    if (level === 4) {
        _apply("batterycritical", [info]);
    }
});

event.on("appResume", function () {
    _apply("resume");
});

event.on("appPause", function () {
    _apply("pause");
});

module.exports = {
    addEventListener: function (type, func) {
        callbacks[type].push(func);
    },

    removeEventListener: function (type, func) {
        delete callbacks[type][callbacks[type]];
    }
};
