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
var nav = ripple('platform/w3c/1.0/navigator'),
    utils = ripple('utils'),
    deviceSettings = ripple('deviceSettings'),
    _self = {};

utils.mixin(nav, _self);

_self.__defineGetter__("language", function () {
    return deviceSettings.retrieve("system.language");
});

_self.__defineSetter__("language", function (value) {
    deviceSettings.persist("system.language", value);
});

module.exports = _self;
