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
var _self,
    event = require('ripple/event'),
    _console = require('ripple/console'),
    deviceSettings = require('ripple/deviceSettings'),
    _lastPercentRemaining;

_self = {
    isCharging: undefined,
    percentRemaining: undefined,

    onChargeStateChange: undefined,
    onLowBattery: undefined,
    onChargeLevelChange: undefined
};

function _getCurrentChargeState(percentRemaining, isCharging) {
    var batteryState;
    if (percentRemaining === 100 && isCharging) {
        batteryState = "full";
    }
    else if (!isCharging) {
        batteryState = "discharging";
    }
    else {
        batteryState = "charging";
    }
    return batteryState;
}

event.on("DeviceBatteryStateChanged", function (isCharging) {
    var callback = _self.onChargeStateChange,
        msg = "",
        batteryLevel = _self.percentRemaining,
        batteryState;

    batteryState = _getCurrentChargeState(batteryLevel, isCharging);

    msg += "Fired onChargeStateChange with batteryState: " + batteryState;

    if (callback && typeof callback === "function") {
        callback.apply(null, [batteryState]);
    }
    else {
        msg += " --> BUT there was no registered callback found.";
    }

    _console.log(msg);
});

event.on("DeviceBatteryLevelChanged", function (percentRemaining) {

    var callback = _self.onChargeLevelChange,
        lowBatteryCallback = _self.onLowBattery,
        msg = "Fired onChargeLevelChange with percentRemaining: " + percentRemaining;

    // blah, stupid Options returning strings
    percentRemaining = parseInt(percentRemaining, 10);

    if (callback && typeof callback === "function") {
        callback.apply(null, [percentRemaining]);
    }
    else {
        msg += " --> BUT there was no registered callback found.";
    }

    _console.log(msg);

    if (percentRemaining <= 10) {

        msg = "Fired onLowBattery with percentRemaining: " + percentRemaining;

        if (lowBatteryCallback && typeof lowBatteryCallback === "function") {
            lowBatteryCallback.apply(null, [percentRemaining]);
        }
        else {
            msg += " --> BUT there was no registered callback found.";
        }

        _console.log(msg);
    }

    if (percentRemaining === 100 || (percentRemaining < 100 && _lastPercentRemaining === 100)) {
        event.trigger("DeviceBatteryStateChanged", [_self.isCharging]);
    }

    _lastPercentRemaining = percentRemaining;

});

_self.__defineGetter__("isCharging", function () {
    return deviceSettings.retrieveAsBoolean("PowerInfo.isCharging");
});

_self.__defineGetter__("percentRemaining", function () {
    return deviceSettings.retrieveAsInt("PowerInfo.percentRemaining");
});

module.exports = _self;
