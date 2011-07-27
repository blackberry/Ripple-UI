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
/* DeviceSettings
 *  A per object store for a platform's settings.
 *  For example, RadioInfo object in WAC has isRadioEnabled that can be true/false
 *  setting => {key: {key1: "test"}}
 */
var _PERSISTENCE_KEY = "devicesettings",
    db = require('ripple/db'),
    utils = require('ripple/utils'),
    platform = require('ripple/platform'),
    _currentDeviceSettings = {},
    _self;

function _default(key) {
    var keys = key.split("."),
        defaults = platform.current().device;

    return keys.length === 2 &&
           defaults[keys[0]] &&
           defaults[keys[0]][keys[1]] &&
           defaults[keys[0]][keys[1]].control ?
           defaults[keys[0]][keys[1]].control.value : undefined;
}

_self = {
    initialize: function () {
        // TODO: remove deprecated DeviceSettings from persisted ones.
        _currentDeviceSettings = db.retrieveObject(_PERSISTENCE_KEY) || {};
    },
    register: function (key, obj) {
        _currentDeviceSettings[key] = obj;
    },

    persist: function (key, obj) {
        if (key) {
            _currentDeviceSettings[key] = obj;
        }

        db.saveObject(_PERSISTENCE_KEY, _currentDeviceSettings);
    },

    retrieve: function (key) {
        return _currentDeviceSettings.hasOwnProperty(key) ?
               _currentDeviceSettings[key] : _default(key);
    },

    retrieveAsInt: function (key) {
        return parseInt(_self.retrieve(key), 10);
    },

    retrieveAsBoolean: function (key) {
        return !!_self.retrieve(key);
    }
};

module.exports = _self;
