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
    platform = require('ripple/platform'),
    utils = require('ripple/utils'),
    _console = require('ripple/console'),
    deviceSettings = require('ripple/deviceSettings'),
    DataNetworkConnectionTypes = require('ripple/platform/wac/1.0/DataNetworkConnectionTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),

_self = {
    isDataNetworkConnected: undefined,
    networkConnectionType: undefined,
    onNetworkConnectionChanged: undefined,

    getNetworkConnectionName: function (networkConnectionType) {
        var foundConnectionType;
        utils.validateArgumentType(networkConnectionType, "string", ExceptionTypes.INVALID_PARAMETER, "networkConnectionType is invalid, expected a string", new Exception());
        foundConnectionType = DataNetworkConnectionTypes[networkConnectionType.toUpperCase()];
        return foundConnectionType || null;
    }
};

event.on("DataNetworkConnectionChanged", function (newConnectionName) {
    var callback = _self.onNetworkConnectionChanged,
        msg = platform.current().name + " :: Fired onNetworkConnectionChanged with newConnectionName: " + newConnectionName;

    if (callback && typeof callback === "function") {
        callback.apply(null, [newConnectionName]);
    }
    else {
        msg += " --> BUT there was no registered callback found.";
    }

    _console.log(msg);
});

_self.__defineGetter__("isDataNetworkConnected", function () {
    return deviceSettings.retrieveAsBoolean("DataNetworkInfo.isDataNetworkConnected");
});

_self.__defineGetter__("networkConnectionType", function () {
    var value = deviceSettings.retrieve("DataNetworkInfo.networkConnectionType");
    return value instanceof Array ? value : [value];
});

module.exports = _self;
