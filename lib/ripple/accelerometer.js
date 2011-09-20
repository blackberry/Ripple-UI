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
    exception = require('ripple/exception'),
    event = require('ripple/event'),
    Rotation = require('ripple/platform/w3c/1.0/Rotation'),
    Acceleration = require('ripple/platform/w3c/1.0/Acceleration'),
    _motion = {
        acceleration: new Acceleration(0, 0, 0),
        accelerationIncludingGravity: new Acceleration(0, 0, -9.81),
        rotationRate: new Rotation(0, 0, 0),
        orientation: new Rotation(0, 0, 0),
        timestamp: new Date().getTime()
    };

function _validateAccelerometerInfo(x, y, z) {
    return !(isNaN(x) || isNaN(y) || isNaN(z));
}

_self = {
    getInfo: function () {
        return utils.copy(_motion);
    },

    setInfo: function (e) {
        var triggerDeviceMotion = false,
            triggerDeviceOrientation = false;

        if (e.x !== undefined && e.y !== undefined && e.z !== undefined) {
            _motion = {
                acceleration: new Acceleration(e.x, e.y, e.z),
                accelerationIncludingGravity: new Acceleration(e.x, e.y, e.z),
                rotationRate: new Rotation(0, 0, 0),
                orientation: new Rotation(e.alpha, e.beta, e.gamma),
                timestamp: new Date().getTime()
            };
            triggerDeviceMotion = true;
            triggerDeviceOrientation = true;
        }
        else {
            _motion = {
                acceleration: new Acceleration(0, 0, 0),
                accelerationIncludingGravity: new Acceleration(0, 0, 0),
                rotationRate: new Rotation(0, 0, 0),
                orientation: new Rotation(0, 0, 0),
                timestamp: new Date().getTime()
            };
        }

        if (triggerDeviceMotion) {
            event.trigger("DeviceMotionEvent", [_motion]);
        }

        if (triggerDeviceOrientation) {
            event.trigger("DeviceOrientationEvent", [_motion]);
        }

        event.trigger("AccelerometerInfoChangedEvent", [_motion]);
    },

    shake: function (shakeXtimes) {
        var id, 
            count = 1, 
            stopCount = shakeXtimes || 17
            oldX = _motion.accelerationIncludingGravity.x;


        id = setInterval(function () {
            var freq = 1,
                amp = 30,
                value = Math.round(amp * Math.sin(freq * count * (180 / Math.PI)) * 100) / 100;

            if (count > stopCount) {
                _motion.accelerationIncludingGravity.x = oldX;
                event.trigger("AccelerometerInfoChangedEvent", [_motion]);
                clearInterval(id);
                return;
            }

            _motion.accelerationIncludingGravity.x = value;

            event.trigger("AccelerometerInfoChangedEvent", [_motion]);

            count++;

        }, 80);

    }
};

module.exports = _self;
