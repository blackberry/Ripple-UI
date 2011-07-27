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
var transport = require('ripple/platform/webworks/2.0.0/client/transport'),
    _uri = "blackberry/app/",
    _self;

_self = {
    exit: function () {
        transport.call(_uri + "exit", {async: true});
    },

    setHomeScreenIcon: function (uri, hover) {
        var result = transport.call(_uri + "setHomeScreenIcon", {
            get: {
                uri: uri,
                hover: hover
            },
            async: true
        });

        return true;
    },

    setHomeScreenName: function (text) {
        var result = transport.call(_uri + "setHomeScreenName", {
            get: {text: text},
            async: true
        });

        return true;
    },

    requestForeground: function () {
        transport.call(_uri + "requestForeground", {async: true});
    },

    requestBackground: function () {
        transport.call(_uri + "requestBackground", {async: true});
    }
};

_self.__defineGetter__("author", function () {
    return transport.call(_uri + "author").data;
});

_self.__defineGetter__("authorEmail", function () {
    return transport.call(_uri + "authorEmail").data;
});

_self.__defineGetter__("authorURL", function () {
    return transport.call(_uri + "authorURL").data;
});

_self.__defineGetter__("copyright", function () {
    return transport.call(_uri + "copyright").data;
});

_self.__defineGetter__("description", function () {
    return transport.call(_uri + "description").data;
});

_self.__defineGetter__("id", function () {
    return transport.call(_uri + "id").data;
});

_self.__defineGetter__("license", function () {
    return transport.call(_uri + "license").data;
});

_self.__defineGetter__("licenseURL", function () {
    return transport.call(_uri + "licenseURL").data;
});

_self.__defineGetter__("name", function () {
    return transport.call(_uri + "name").data;
});

_self.__defineGetter__("version", function () {
    return transport.call(_uri + "version").data;
});

module.exports = _self;
