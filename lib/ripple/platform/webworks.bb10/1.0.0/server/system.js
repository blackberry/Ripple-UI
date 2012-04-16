
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
    devices = require('ripple/devices'),
    app = require('ripple/app'),
    client = require('ripple/platform/webworks.bb10/1.0.0/client/system'),
    utils = require('ripple/utils'),
    _self;

function _is(feature) {
    return {
        allowedFor: function (location) {
            return feature && feature.URIs.some(function (uri) {
                return uri.value === location ||
                      (location.indexOf(uri.value) >= 0 && uri.subdomains);
            });
        }
    };
}

_self = {
    hasCapability: function (args) {
        var capabilities = devices.getCurrentDevice().capabilities;
        return {
            code: 1,
            data: capabilities ? capabilities.some(function (type) {
                return type === args.capability;
            }) : false
        };
    },
    hasPermission: function (args) {
        var info = app.getInfo(),
            feature = info.features ? info.features[args.desiredModule] : null;

        return {code: 1, data: feature === null || _is(feature).allowedFor(utils.location().href) ? client.ALLOW : client.DENY};
    }
};

module.exports = _self;
