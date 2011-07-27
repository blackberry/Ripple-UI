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
    event = require('ripple/event'),
    _console = require('ripple/console'),
    platform = require('ripple/platform'),
    deviceSettings = require('ripple/deviceSettings');

_self = {
    isRoaming: undefined,
    radioSignalStrengthPercent: undefined,
    isRadioEnabled: undefined,
    radioSignalSource: undefined,
    onSignalSourceChange: undefined
};

event.on("RadioSignalSourceChanged", function () {
    var callback = _self.onSignalSourceChange,
        isRoaming = _self.isRoaming,
        signalSource = _self.radioSignalSource,
        msg = platform.current().name + " :: Fired onSignalSourceChange. signalSource: " + signalSource + ", isRoaming: " + isRoaming;

    if (callback && typeof callback === "function") {
        callback.apply(null, [signalSource, isRoaming]);
    }
    else {
        msg += " --> BUT there was no registered callback found.";
    }

    _console.log(msg);
});

_self.__defineGetter__("radioSignalSource", function () {
    return deviceSettings.retrieve("RadioInfo.radioSignalSource");
});

_self.__defineGetter__("isRoaming", function () {
    return deviceSettings.retrieveAsBoolean("RadioInfo.isRoaming");
});

_self.__defineGetter__("isRadioEnabled", function () {
    return deviceSettings.retrieveAsBoolean("RadioInfo.isRadioEnabled");
});

_self.__defineGetter__("radioSignalStrengthPercent", function () {
    return deviceSettings.retrieveAsInt("RadioInfo.radioSignalStrengthPercent");
});

module.exports = _self;
