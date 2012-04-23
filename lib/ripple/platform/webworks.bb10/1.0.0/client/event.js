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
        batterycritical: []
    };

event.on("DeviceBatteryStateChanged", function (charging) {
    var info = {
        isPlugged: charging,
        level: settings.retrieve("battery.level")
    };

    callbacks.batterystatus.forEach(function (cb) {
        cb.apply(null, [info]);
    });
});

event.on("DeviceBatteryLevelChanged", function (level) {
    var info = {
        isPlugged: settings.retrieve("battery.state"),
        level: level
    };

    callbacks.batterystatus.forEach(function (cb) {
        cb.apply(null, [info]);
    });

    if (level == 14) {
        callbacks.batterylow.forEach(function (cb) {
            cb.apply(null, [info]);
        });
    }

    if (level == 4) {
        callbacks.batterycritical.forEach(function (cb) {
            cb.apply(null, [info]);
        });
    }
});

module.exports = {
    addEventListener: function (type, func) {
        callbacks[type].push(func);
    },

    removeEventListener: function (type, func) {
        delete callbacks[type][callbacks[type]];
    }
};
