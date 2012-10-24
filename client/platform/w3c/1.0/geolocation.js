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
var geo = require('ripple/client/geo'),
    Position = require('ripple/client/platform/w3c/1.0/Position'),
    PositionError = require('ripple/client/platform/w3c/1.0/PositionError'),
    _watches = {},
    _self;

function createPosition() {
    var position = new Position(),
        positionInfo = geo.getPositionInfo();

    position.coords.latitude = positionInfo.latitude;
    position.coords.longitude = positionInfo.longitude;
    position.coords.altitude = positionInfo.altitude;
    position.coords.altitudeAccuracy = positionInfo.altitudeAccuracy;
    position.coords.accuracy = positionInfo.accuracy;
    position.coords.heading = positionInfo.heading;
    position.coords.speed = positionInfo.speed;
    position.timestamp = positionInfo.timeStamp.getTime();

    return position;
}

_self = {
    getCurrentPosition: function (onSuccess, onError) {
        var delay = ((geo.delay || 0) * 1000) || 1,
            timeout = geo.timeout;

        window.setTimeout(function () {
            if (timeout) {
                var error = new PositionError();
                error.code = PositionError.TIMEOUT;
                error.message = "position timed out";

                onError(error);
            }
            else {
                // TODO: build facility to trigger onError() from emulator
                // see pivotal item: https://www.pivotaltracker.com/story/show/7040343
                _self.lastPosition = createPosition();
                onSuccess(_self.lastPosition);
            }
        }, delay);
    },

    watchPosition: function (geolocationSuccess, geolocationError, geolocationOptions) {
        var watchId = (new Date()).getTime().toString(),
            watchObj = {},
            timeout;

        if (geolocationOptions) {
            timeout = geolocationOptions.timeout || 10000;

            watchObj = {
                onSuccess: geolocationSuccess,
                onError: geolocationError,
                interval: timeout
            };

            _watches[watchId] = watchObj;

            _watches[watchId].intervalId = window.setInterval(function () {
                _self.getCurrentPosition(_watches[watchId].onSuccess, _watches[watchId].onError);
            }, timeout);

        }
        else {
            if (typeof geolocationError === "function") {
                window.setTimeout(function () {
                    geolocationError();
                }, 1);
            }
        }

        return watchId;
    },

    lastPosition: null,

    clearWatch: function (watchId) {
        window.clearInterval(_watches[watchId].intervalId);
        delete _watches[watchId];
    }
};

module.exports = _self;
