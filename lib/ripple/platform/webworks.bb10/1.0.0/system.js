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
var deviceSettings = require('ripple/deviceSettings'),
    devices = require('ripple/devices'),
    app = require('ripple/app'),
    utils = require('ripple/utils'),
    _self;

function _is(feature) {
    return {
        allowedFor: function (location) {
            return feature && feature.URIs.some(function (uri) {
                return uri.value === location ||
                      (location.indexOf(uri.value) >= 0 && uri.subdomains);
            });
        }
    };
}

_self = {
    hasCapability: function (capability) {
        var capabilities = devices.getCurrentDevice().capabilities;
        return capabilities ? capabilities.some(function (type) {
                return type === capability;
            }) : false;
    },
    hasPermission: function (desiredModule) {
        var info = app.getInfo(),
            feature = info.features ? info.features[desiredModule] : null;

        return feature === null || _is(feature).allowedFor(utils.location().href) ? _self.ALLOW : _self.DENY;
    }
};

_self.__defineGetter__("ALLOW", function () {
    return 0;
});

_self.__defineGetter__("DENY", function () {
    return 1;
});

_self.__defineGetter__("softwareVersion", function () {
    return devices.getCurrentDevice().osVersion;
});

_self.__defineGetter__("hardwareId", function () {
    return devices.getCurrentDevice().hardwareId;
});

_self.__defineGetter__("language", function () {
    return deviceSettings.retrieve("system.language");
});

_self.__defineGetter__("region", function () {
    return deviceSettings.retrieve("system.region");
});

module.exports = _self;
