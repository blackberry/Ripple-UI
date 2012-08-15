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
    transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    system = require('ripple/platform/webworks.core/2.0.0/client/system'),
    _uri = "blackberry/system/",
    _self;

_self = {
    setHomeScreenBackground: function (filePath) {
        transport.call(_uri + "setHomeScreenBackground", {
            get: {filePath: filePath},
            async: true
        });
    },
};

(function () {
    // HACK: can't type check if system[key] is a function, sets off getters
    // also can't use utils.mixin or forEach for the same reason
    function get(i) {
        return function () {
            return system[i];
        };
    }

    for (var key in system) {
        if (system.hasOwnProperty(key)) {
            _self.__defineGetter__(key, get(key));
        }
    }
}());

module.exports = _self;
