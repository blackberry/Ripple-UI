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
    _onBatteryStateChange,
    _onBatteryLevelChange,
    _states = {
        UNKNOWN: 0,
        FULL: 1,
        CHARGING: 2,
        UNPLUGGED: 3
    },
    _battery = {
        state: _states.UNKNOWN,
        charging: null,
        level: null
    };

function _getState() {
    return _battery.level === 100 ? _states.FULL :
           _battery.charging ? _states.CHARGING : _states.UNPLUGGED;
}

event.on("DeviceBatteryStateChanged", function (charging) {
    _battery.charging = charging;
    _battery.state = _getState();
    return _onBatteryStateChange && _onBatteryStateChange(_battery.state);
});

event.on("DeviceBatteryLevelChanged", function (level) {
    _battery.level = parseInt(level, 10);
    if (_onBatteryLevelChange) {
        _onBatteryLevelChange(_battery.level);
    }

    if (_battery.level === 100) {
        _battery.state = _getState();
        return _onBatteryStateChange && _onBatteryStateChange(_battery.state);
    }
});

module.exports = {
    deviceBatteryLevelChange: function (handler) {
        _onBatteryLevelChange = handler;
    },
    deviceBatteryStateChange: function (handler) {
        _onBatteryStateChange = handler;
    }
};
