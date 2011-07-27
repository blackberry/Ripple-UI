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
    exception = require('ripple/exception'),
    _console = require('ripple/console'),
    geo = require('ripple/geo'),
    event = require('ripple/event'),
    deviceSettings = require('ripple/deviceSettings'),
    PositionInfo = require('ripple/platform/wac/1.0/PositionInfo'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    _self;

event.on("ScreenChangeDimensions", function (width, height) {
    try {
        if (typeof _self.onScreenChangeDimensions === 'function') {
            _self.onScreenChangeDimensions(width, height);
        }
        _console.log(platform.current().name + " :: called DeviceStateInfo.onScreenChangeDimensions callback function with width = " + width + " and height = " + height);
    } catch (e) {
        exception.handle(e, false);
    }
});

_self = {
    availableMemory: undefined,
    language: undefined,
    keypadLightOn: undefined,
    backLightOn: undefined,
    processorUtilizationPercent: undefined,
    audioPath: undefined,

    onPositionRetrieved: undefined,

    requestPositionInfo: function (method) {
        utils.validateNumberOfArguments(1, 1, arguments.length,
            ExceptionTypes.INVALID_PARAMETER, "requestPositionInfo invalid number of parameters", new Exception());
        utils.validateArgumentType(method, "string",
            ExceptionTypes.INVALID_PARAMETER, "requestPositionInfo invalid parameter", new Exception());

        if (!(method.match(/gps|agps|cellid/))) {
            exception.raise(ExceptionTypes.INVALID_PARAMETER,
                    "Invalid method, expected (gps, agps or cellid)", Exception);
        }

        if (typeof _self.onPositionRetrieved === "function") {
            var delay = geo.delay * 1000,
                timeout = geo.timeout;
            setTimeout(function () {
                var pos = PositionInfo,
                    errorObj = {};

                if (timeout) {
                    //create
                    utils.forEach(pos, function (val, key) {
                        errorObj[key] = undefined;
                    });
                    pos = errorObj;
                }
                _self.onPositionRetrieved(pos, method);
            }, delay);
        }
    },

    onScreenChangeDimensions: undefined,

    onFlipEvent: undefined
};

_self.__defineGetter__("availableMemory", function () {
    return deviceSettings.retrieveAsInt("DeviceStateInfo.availableMemory");
});

_self.__defineGetter__("language", function () {
    return deviceSettings.retrieve("DeviceStateInfo.language");
});

_self.__defineGetter__("keypadLightOn", function () {
    return deviceSettings.retrieveAsBoolean("DeviceStateInfo.keypadLightOn");
});

_self.__defineGetter__("backLightOn", function () {
    return deviceSettings.retrieveAsBoolean("DeviceStateInfo.backLightOn");
});

_self.__defineGetter__("audioPath", function () {
    return deviceSettings.retrieve("DeviceStateInfo.audioPath");
});

_self.__defineGetter__("processorUtilizationPercent", function () {
    return deviceSettings.retrieve("DeviceStateInfo.processorUtilizationPercent");
});

module.exports = _self;
