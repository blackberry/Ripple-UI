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
var transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    utils = require('ripple/utils'),
    _self,
    _callbacks = {};

function _poll(evt, args, callback) {
    _callbacks[evt + args.key] = callback;

    transport.poll("blackberry/system/event/" + evt, {get: args}, function () {
        var func = _callbacks[evt + args.key];

        if (func) {
            func();
        }

        return !!func;
    });
}

_self = {
    onCoverageChange: function (callback) {
        _poll("onCoverageChange", {}, callback);
    },

    onHardwareKey: function (key, callback) {
        _poll("onHardwareKey", {key: key}, callback);
    }
};

_self.__defineGetter__("KEY_BACK", function () {
    return 0;
});
_self.__defineGetter__("KEY_MENU", function () {
    return 1;
});
_self.__defineGetter__("KEY_CONVENIENCE_1", function () {
    return 2;
});
_self.__defineGetter__("KEY_CONVENIENCE_2", function () {
    return 3;
});
_self.__defineGetter__("KEY_STARTCALL", function () {
    return 4;
});
_self.__defineGetter__("KEY_ENDCALL", function () {
    return 5;
});
_self.__defineGetter__("KEY_VOLUMEDOWN", function () {
    return 6;
});
_self.__defineGetter__("KEY_VOLUMEUP", function () {
    return 7;
});

module.exports = _self;
