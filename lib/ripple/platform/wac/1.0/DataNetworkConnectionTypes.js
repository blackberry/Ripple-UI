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
    _self = {
        "BLUETOOTH": undefined,
        "EDGE": undefined,
        "EVDO": undefined,
        "GPRS": undefined,
        "IRDA": undefined,
        "LTE": undefined,
        "ONEXRTT": undefined,
        "WIFI": undefined
    };

utils.forEach(_self, function (value, property) {
    _self.__defineGetter__(property, function () {
        return property;
    });
});

module.exports = _self;
