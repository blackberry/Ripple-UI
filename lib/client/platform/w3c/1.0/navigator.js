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
var _original = window.navigator,
    devices = ripple('devices'),
    _self = {};

(function () {
    var key,
        nav = window.navigator;

    function _handle(obj, key) {
        return typeof obj[key] !== "function" ? obj[key] : function () {
            return obj[key].apply(obj, Array.prototype.slice.call(arguments));
        };
    }

    for (key in nav) {
        _self[key] = _handle(nav, key);
    }
}());

_self.__defineGetter__('userAgent', function () {
    return devices.getCurrentDevice().userAgent || _original.userAgent;
});

module.exports = _self;
