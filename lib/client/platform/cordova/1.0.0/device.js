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
var _self = {},
    event = ripple('event'),
    devices = ripple('devices');


event.on("HardwareKey", function (key) {
    event.trigger("HardwareKeyDefault", [key]);
});

_self.__defineGetter__("name", function () {
    return devices.getCurrentDevice().name;
});

_self.__defineGetter__("platform", function () {
    return devices.getCurrentDevice().osName;
});

_self.__defineGetter__("uuid", function () {
    return devices.getCurrentDevice().uuid;
});

_self.__defineGetter__("version", function () {
    return devices.getCurrentDevice().osVersion;
});

_self.phonegap = "placeholder string";

module.exports = _self;
