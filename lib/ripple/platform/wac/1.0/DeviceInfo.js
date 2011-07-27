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
var utils = require('ripple/utils'),
    deviceSettings = require('ripple/deviceSettings'),
    platform = require('ripple/platform'),
    devices = require('ripple/devices'),
    _self;

_self = {
    ownerInfo: undefined, // return AddressBookItem
    phoneColorDepthDefault: undefined,
    phoneFirmware: undefined,
    phoneManufacturer: undefined,
    phoneModel: undefined,
    phoneOS: undefined,
    phoneSoftware: undefined,
    phoneScreenHeightDefault: undefined,
    phoneScreenWidthDefault: undefined,
    totalMemory: undefined
};

function _getDeviceAttribute(attr) {
    var devicePointer = devices.getCurrentDevice();
    utils.forEach(attr.split("."), function (dot) {
        devicePointer = devicePointer[dot];
    });
    return devicePointer;
}

_self.__defineGetter__("phoneColorDepthDefault", function () {
    return deviceSettings.retrieveAsInt("DeviceInfo.phoneColorDepthDefault");
});

_self.__defineGetter__("phoneFirmware", function () {
    return _getDeviceAttribute("firmware");
});

_self.__defineGetter__("phoneManufacturer", function () {
    return _getDeviceAttribute("manufacturer");
});

_self.__defineGetter__("phoneOS", function () {
    return _getDeviceAttribute("osName") + " " + _getDeviceAttribute("osVersion");
});

_self.__defineGetter__("phoneModel", function () {
    return _getDeviceAttribute("model");
});

_self.__defineGetter__("phoneSoftware", function () {
    return _getDeviceAttribute("osVersion");
});

_self.__defineGetter__("phoneScreenHeightDefault", function () {
    return _getDeviceAttribute("screen.height");
});

_self.__defineGetter__("phoneScreenWidthDefault", function () {
    return _getDeviceAttribute("screen.width");
});

_self.__defineGetter__("totalMemory", function () {
    return deviceSettings.retrieveAsInt("DeviceInfo.totalMemory");
});

module.exports = _self;
