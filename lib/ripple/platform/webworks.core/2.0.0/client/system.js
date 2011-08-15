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
    _uri = "blackberry/system/",
    _self;

_self = {
    hasCapability: function (capability) {
        return transport.call(_uri + "hasCapability", {
            get: {capability: capability}
        });
    },

    hasDataCoverage: function () {
        return transport.call(_uri + "hasDataCoverage");
    },

    hasPermission: function (desiredModule) {
        return transport.call(_uri + "hasPermission", {
            get: {desiredModule: desiredModule}
        });
    },

    isMassStorageActive: function () {
        return transport.call(_uri + "isMassStorageActive");
    },

    setHomeScreenBackground: function (filePath) {
        transport.call(_uri + "setHomeScreenBackground", {
            get: {filePath: filePath},
            async: true
        });
    }
};

_self.__defineGetter__("model", function () {
    return transport.call(_uri + "model");
});
_self.__defineGetter__("scriptApiVersion", function () {
    return transport.call(_uri + "scriptApiVersion");
});
_self.__defineGetter__("softwareVersion", function () {
    return transport.call(_uri + "softwareVersion");
});

_self.__defineGetter__("ALLOW", function () {
    return 0;
});
_self.__defineGetter__("DENY", function () {
    return 1;
});
_self.__defineGetter__("PROMPT", function () {
    return 2;
});
_self.__defineGetter__("NOT_SET", function () {
    return 3;
});

module.exports = _self;
