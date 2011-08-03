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
var _self,
    Service = require('ripple/platform/webworks.core/2.0.0/client/identity/Service'),
    Transport = require('ripple/platform/webworks.core/2.0.0/client/identity/Transport'),
    utils = require('ripple/utils'),
    platform = require('ripple/platform'),
    deviceSettings = require('ripple/deviceSettings'),
    _transportTypes = [
        {name: "TCP Cellular", type: "TCP Cellular"},
        {name: "Wap", type: "Wap"},
        {name: "Wap 2.0", type: "Wap 2.0"},
        {name: "MDS", type: "MDS"},
        {name: "BIS B", type: "Bis B"},
        {name: "Unite!", type: "Unite!"},
        {name: "TCP Wifi", type: "TCP Wifi"},
    ],
    _services = [
        new Service(),
        new Service()
    ];

function _isTransportAvailable(transport) {
    return deviceSettings.retrieveAsBoolean("transports." + transport.type);
}

utils.mixin({
    name: "Super Dave Osborne",
    emailAddress: "dave@stunt.com",
    isDefault: true,
    type: Service.TYPE_EMAIL
}, _services[0]);

utils.mixin({
    name: "Fred Penner",
    emailAddress: "fred@fredpenner.com",
    isDefault: false,
    type: Service.TYPE_CONTACT
}, _services[1]);

_self = {
    getDefaultService: function () {
        var serices = _services.filter(function (service) {
            return service.isDefault === true;
        });
        return {code: 1, data: serices};
    },
    getServiceList: function () {
        return {code: 1, data: _services};
    },
    getTransportList: function () {
        var transports = _transportTypes.filter(function (transport) {
            return _isTransportAvailable(transport);
        }).map(function (transport) {
            return new Transport(transport.name, transport.type);
        });
        return {code: 1, data: transports};
    },
    IMEI: function () {
        return {code: 1, data: deviceSettings.retrieve("identity.IMEI")};
    },
    IMSI: function () {
        return {code: 1, data: deviceSettings.retrieve("identity.IMSI")};
    },
    PIN: function () {
        return {code: 1, data: deviceSettings.retrieve("identity.PIN")};
    },
    phone: require('ripple/platform/webworks.core/2.0.0/server/identity/phone')
};

module.exports = _self;
