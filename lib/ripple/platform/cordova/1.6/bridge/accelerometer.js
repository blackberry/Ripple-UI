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
var utils = require('ripple/utils'),
    event = require('ripple/event'),
    _current = {x: 0, y: 0, z: 0, timestamp: (new Date()).getTime()};

event.on("AccelerometerInfoChangedEvent", function (accelerometerInfo) {
    _current.x = accelerometerInfo.accelerationIncludingGravity.x / 9.8;
    _current.y = accelerometerInfo.accelerationIncludingGravity.y / 9.8;
    _current.z = accelerometerInfo.accelerationIncludingGravity.z / 9.8;
    _current.timestamp = (new Date()).getTime();
});

module.exports = {
    getTimeout: function (success, error, args) {
        return success && success(1);
    },

    setTimeout: function (success, error, args) {
        //do nothing
        return success && success();
    },

    getAcceleration: function (success, error, args) {
        // TODO: build facility to trigger onError() from emulator
        // see pivotal item: https://www.pivotaltracker.com/story/show/7040343
        success(utils.copy(_current));
    }
};
