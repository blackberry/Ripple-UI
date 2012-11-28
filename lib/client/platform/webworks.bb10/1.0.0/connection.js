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
var deviceSettings = ripple('deviceSettings'),
    _self = {};

_self.__defineGetter__("type", function () {
    return deviceSettings.retrieve("NetworkStatus.connectionType");
});

_self.__defineGetter__("UNKNOWN", function () {
    return "unknown";
});
_self.__defineGetter__("ETHERNET", function () {
    return "ethernet";
});
_self.__defineGetter__("WIFI", function () {
    return "wifi";
});
_self.__defineGetter__("BLUETOOTH_DUN", function () {
    return "bluetooth_dun";
});
_self.__defineGetter__("USB", function () {
    return "usb";
});
_self.__defineGetter__("VPN", function () {
    return "vpn";
});
_self.__defineGetter__("BB", function () {
    return "rim-bb";
});
_self.__defineGetter__("CELL_2G", function () {
    return "2g";
});
_self.__defineGetter__("CELL_3G", function () {
    return "3g";
});
_self.__defineGetter__("CELL_4G", function () {
    return "4g";
});
_self.__defineGetter__("NONE", function () {
    return "none";
});

module.exports = _self;
