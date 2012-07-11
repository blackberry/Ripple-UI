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
var Acceleration = require('ripple/platform/phonegap/1.0.0/Acceleration'),
    utils = require('ripple/utils'),
    event = require('ripple/event'),
    _accelerometerInfo = new Acceleration(),
    _watches = {},
    self;

module.exports = self = {
    getCurrentAcceleration: function (onSuccess, onError) {
        // TODO: implement error call if accelerometer is not available, to be driven by behaviours?

        if (typeof onSuccess === "function") {
            setTimeout(function () {
                // TODO: build facility to trigger onError() from emulator
                // see pivotal item: https://www.pivotaltracker.com/story/show/7040343
                onSuccess(utils.copy(_accelerometerInfo));
            }, 1);
        }

    },

    watchAcceleration: function (accelerometerSuccess, accelerometerError, accelerometerOptions) {
        var watchId = (new Date()).getTime().toString(),
            watchObj = {};


        if (accelerometerOptions &&
                accelerometerOptions.frequency && typeof
                accelerometerOptions.frequency === "number" &&
                accelerometerOptions.frequency === Math.floor(accelerometerOptions.frequency)) {

            watchObj = {
                onSuccess: accelerometerSuccess,
                onError: accelerometerError,
                interval: accelerometerOptions.frequency
            };

            _watches[watchId] = watchObj;

            _watches[watchId].intervalId = setInterval(function () {
                self.getCurrentAcceleration(_watches[watchId].onSuccess, _watches[watchId].onError);
            }, accelerometerOptions.frequency);

        }
        else {
            if (typeof accelerometerError === "function") {
                setTimeout(function () {
                    accelerometerError();
                }, 1);
            }
        }

        return watchId;
    },

    clearWatch: function (watchId) {
        clearInterval(_watches[watchId].intervalId);
    }
};

event.on("AccelerometerInfoChangedEvent", function (accelerometerInfo) {
    _accelerometerInfo.x = accelerometerInfo.accelerationIncludingGravity.x / 9.8;
    _accelerometerInfo.y = accelerometerInfo.accelerationIncludingGravity.y / 9.8;
    _accelerometerInfo.z = accelerometerInfo.accelerationIncludingGravity.z / 9.8;
    _accelerometerInfo.timestamp = (new Date()).getTime();
});
