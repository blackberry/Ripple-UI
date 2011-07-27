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
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    exception = require('ripple/exception'),
    event = require('ripple/event'),
    _SAVE_KEY = "accelerometer-key",
    _accelerometerInfo = {
        x: 0,
        y: 9.81,
        z: 0
    },
    _cachedAccelerometerInfo = utils.copy(_accelerometerInfo);

function _validateAccelerometerInfo(x, y, z) {
    return !(isNaN(x) || isNaN(y) || isNaN(z));
}

_self = {
    initialize: function () {
        _accelerometerInfo = db.retrieveObject(_SAVE_KEY) || _accelerometerInfo;
        _cachedAccelerometerInfo = utils.copy(_accelerometerInfo);
    },

    getInfo: function (getCachedInfo) {
        if (!getCachedInfo) {
            _cachedAccelerometerInfo.x = _accelerometerInfo.x;
            _cachedAccelerometerInfo.y = _accelerometerInfo.y;
            _cachedAccelerometerInfo.z = _accelerometerInfo.z;
        }

        return utils.copy(_cachedAccelerometerInfo);
    },

    setInfo: function (x, y, z) {
        x = x || 0;
        y = y || 0;
        z = z || 0;

        if (!_validateAccelerometerInfo(x, y, z)) {
            exception.raise(exception.types.Accelerometer, "Invalid accelerometer info input");
        }

        _accelerometerInfo.x = x;
        _accelerometerInfo.y = y;
        _accelerometerInfo.z = z;

        db.saveObject(_SAVE_KEY, _accelerometerInfo);

        event.trigger("AccelerometerInfoChangedEvent", [_accelerometerInfo]);
    },

    shake: function (shakeXtimes) {
        var id, count = 1, stopCount = shakeXtimes || 17;

        id = setInterval(function () {
            var freq = 1,
                amp = 30,
                value = Math.round(amp * Math.sin(freq * count * (180 / Math.PI)) * 100) / 100;

            if (count > stopCount) {
                _accelerometerInfo.x = 0;
                event.trigger("AccelerometerInfoChangedEvent", [_accelerometerInfo]);
                db.saveObject(_SAVE_KEY, _accelerometerInfo);
                clearInterval(id);
                return;
            }

            _accelerometerInfo.x = value;

            event.trigger("AccelerometerInfoChangedEvent", [_accelerometerInfo]);

            count++;

        }, 80);

    }
};

module.exports = _self;
