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
    _self = {};

_self.__defineGetter__("type", function () {
    return deviceSettings.retrieve("NetworkStatus.connectionType");
});

_self.__defineGetter__("UNKNOWN", function () { return 0; });
_self.__defineGetter__("ETHERNET", function () { return 1; });
_self.__defineGetter__("WIFI", function () { return 2; });
_self.__defineGetter__("BLUETOOTH_DUN", function () { return 3; });
_self.__defineGetter__("USB", function () { return 4; });
_self.__defineGetter__("VPN", function () { return 5; });
_self.__defineGetter__("BB", function () { return 6; });
_self.__defineGetter__("CELULAR", function () { return 7; });
_self.__defineGetter__("NONE", function () { return 8; });

module.exports = _self;
