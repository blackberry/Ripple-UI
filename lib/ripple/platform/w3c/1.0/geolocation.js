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
var platform = require('ripple/platform'),
    utils = require('ripple/utils'),
    geo = require('ripple/geo'),
    event = require('ripple/event'),
    Position = require('ripple/platform/w3c/1.0/Position'),
    PositionError = require('ripple/platform/w3c/1.0/PositionError'),
    _positionInfo = new Position(),
    _watches = {},
    _self;

event.on("PositionInfoUpdatedEvent", function (positionInfo) {
    _positionInfo.coords.latitude = positionInfo.latitude;
    _positionInfo.coords.longitude = positionInfo.longitude;
    _positionInfo.coords.altitude = positionInfo.altitude;
    _positionInfo.coords.altitudeAccuracy = positionInfo.altitudeAccuracy;
    _positionInfo.coords.accuracy = positionInfo.accuracy;
    _positionInfo.coords.heading = positionInfo.heading;
    _positionInfo.coords.speed = positionInfo.speed;
    _positionInfo.timestamp = positionInfo.timeStamp.getTime();
});

_self = {
    getCurrentPosition: function (onSuccess, onError) {
        var delay = ((geo.delay || 0) * 1000) || 1,
            timeout = geo.timeout;

        window.setTimeout(function () {
            if (timeout) {
                var error = new PositionError();
                error.code = PositionError.TIMEOUT;
                error.message = "postion timed out";

                onError(error);
            }
            else {
                // TODO: build facility to trigger onError() from emulator
                // see pivotal item: https://www.pivotaltracker.com/story/show/7040343
                _self.lastPosition = utils.copy(_positionInfo);
                onSuccess(_self.lastPosition);
            }
        }, delay);
    },

    watchPosition: function (geolocationSuccess, geolocationError, geolocationOptions) {
        var watchId = (new Date()).getTime().toString(),
            watchObj = {};

        if (geolocationOptions &&
                geolocationOptions.frequency && typeof
                geolocationOptions.frequency === "number" &&
                geolocationOptions.frequency === Math.floor(geolocationOptions.frequency)) {

            watchObj = {
                onSuccess: geolocationSuccess,
                onError: geolocationError,
                interval: geolocationOptions.frequency
            };

            _watches[watchId] = watchObj;

            _watches[watchId].intervalId = window.setInterval(function () {
                _self.getCurrentPosition(_watches[watchId].onSuccess, _watches[watchId].onError);
            }, geolocationOptions.frequency);

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
