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
    _self;

function _bind(name, win) {
    var callback = null;

    win.__defineGetter__(name, function () {
        return callback;
    });

    win.__defineSetter__(name, function (cb) {
        callback = cb;
    });

    return {
        get: function () {
            return callback;
        },
        set: function (value) {
            callback = value;
        },
        exec: function (arg) {
            return callback && callback(arg);
        },
        unbind: function (cb) {
            callback = cb === callback ? null : callback;
        }
    };
}
_self = {
    init: function (frame) {
        var widgetWindow = frame.contentWindow,
            _motion,
            _orientation,
            add = widgetWindow.addEventListener,
            remove = widgetWindow.removeEventListener;

        //Hang events off window (these are used to check for API existence by developer)
        widgetWindow.DeviceMotionEvent = function DeviceMotionEvent() {};
        widgetWindow.DeviceOrientationEvent = function DeviceOrientationEvent() {};

        _motion = _bind("ondevicemotion", widgetWindow);
        _orientation = _bind("ondeviceorientation", widgetWindow);

        widgetWindow.addEventListener = function (event, callback) {
            if (event === "deviceorientation") {
                _orientation.set(callback);
            }
            else if (event === "devicemotion") {
                _motion.set(callback);
            }
            else {
                add(event, callback);
            }
        };

        widgetWindow.removeEventListener = function (event, callback) {
            _motion.unbind(callback);
            _orientation.unbind(callback);
            remove(callback);
        };

        event.on("DeviceMotionEvent", function (motion) {
            _motion.exec({
                acceleration: motion.acceleration,
                accelerationIncludingGravity: motion.accelerationIncludingGravity,
                rotationRate: motion.rotationRate
            });
        });

        event.on("DeviceOrientationEvent", function (motion) {
            _orientation.exec(motion.orientation);
        });
    }
};

module.exports = _self;
