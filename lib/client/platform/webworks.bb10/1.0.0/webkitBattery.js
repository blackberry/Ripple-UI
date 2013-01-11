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

var deviceSettings = ripple('deviceSettings'),
    event = ripple('event'),
    handlers = {
        levelchange: [],
        chargingtimechange: [],
        dischargingtimechange: [],
        chargingchange: []
    },
    call = function (func) {
        return func && func();
    },
    battery = {
        onchargingchange: null,
        onchargingtimechange: null,
        ondischargingtimechange: null,
        onlevelchange: null,
        addEventListener: function (type, callback) {
            if (!handlers[type]) return;

            if (handlers[type].indexOf(callback) < 0) {
                handlers[type].push(callback);
            }
        },
        removeEventListener: function (type, callback) {
            if (!handlers[type]) return;

            var idx = handlers[type].indexOf(callback);

            if (idx < 0) return;

            handlers[type].splice(idx, 1);
        }
    };

battery.__defineGetter__("charging", function () {
    return deviceSettings.retrieveAsBoolean('battery.state');
});

battery.__defineGetter__("chargingTime", function () {
    return deviceSettings.retrieveAsInt('battery.chargingTime');
});

battery.__defineGetter__("dischargingTime", function () {
    return deviceSettings.retrieveAsInt('battery.dischargingTime');
});

battery.__defineGetter__("level", function () {
    // value should be between 0 and 1
    return deviceSettings.retrieveAsInt('battery.level') / 100;
});

event.on("DeviceBatteryLevelChanged", function () {
    handlers.levelchange.forEach(call);
    return battery.onlevelchange && battery.onlevelchange();
});

event.on("DeviceBatteryChargingTimeChanged", function () {
    handlers.chargingtimechange.forEach(call);
    return battery.onchargingtimechange && battery.onchargingtimechange();
});

event.on("DeviceBatteryStateChanged", function () {
    handlers.chargingchange.forEach(call);
    return battery.onchargingchange && battery.onchargingchange();
});

event.on("DeviceBatteryDischargingTimeChanged", function () {
    handlers.dischargingtimechange.forEach(call);
    return battery.ondischargingtimechange && battery.ondischargingtimechange();
});

module.exports = battery;
