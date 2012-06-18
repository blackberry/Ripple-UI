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
    geo = require('ripple/geo'),
    utils = require('ripple/utils'),
    PositionError = require('ripple/platform/w3c/1.0/PositionError'),
    _watches = {},
    _current = {
        "latitude": 43.465187,
        "longitude": -80.522372,
        "altitude": 100,
        "accuracy": 150,
        "altitudeAccuracy": 80,
        "heading": 0,
        "velocity": 0,
    },
    _error;

function _getCurrentPosition(win, fail) {
    if (geo.timeout) {
        if (typeof fail === "function") {
            var positionError = new PositionError();

            positionError.code = PositionError.TIMEOUT;
            positionError.message = "postion timed out";
            fail(positionError);
        }
    }
    else {
        if (typeof win === "function") {
            win(utils.copy(_current));
        }
    }
}

event.on("PositionInfoUpdatedEvent", function (pi) {
    _current.latitude = pi.latitude;
    _current.longitude = pi.longitude;
    _current.altitude = pi.altitude;
    _current.accuracy = pi.accuracy;
    _current.altitudeAccuracy = pi.altitudeAccuracy;
    _current.heading = pi.heading;
    _current.velocity = pi.speed;

    utils.forEach(_watches, function (watch) {
        _getCurrentPosition(watch.win, watch.fail);
    });
});

module.exports = {
    getLocation: function (success, error, args) {
        _getCurrentPosition(success, error);
    },

    addWatch: function (success, error, args) {
        _watches[args[0]] = {
            win: success,
            fail: error
        };
    },

    clearWatch: function (id) {
        delete _watches[id];
    }
};
