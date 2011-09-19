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
var transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/app/",
    _self;

_self = {
    exit: function () {
        transport.call(_uri + "exit", {async: true});
    },

    setHomeScreenIcon: function (uri, hover) {
        transport.call(_uri + "setHomeScreenIcon", {
            get: {
                uri: uri,
                hover: hover
            },
            async: true
        });

        return true;
    },

    setHomeScreenName: function (text) {
        transport.call(_uri + "setHomeScreenName", {
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
    },

    removeBannerIndicator: function () {
        transport.call(_uri + "removeBannerIndicator", {async: true});
    },

    showBannerIndicator: function (icon, count) {
        transport.call(_uri + "showBannerIndicator", {
            get: {
                icon: icon,
                count: count
            },
            async: true
        });
    },
};

_self.__defineGetter__("author", function () {
    return transport.call(_uri + "author");
});

_self.__defineGetter__("authorEmail", function () {
    return transport.call(_uri + "authorEmail");
});

_self.__defineGetter__("authorURL", function () {
    return transport.call(_uri + "authorURL");
});

_self.__defineGetter__("copyright", function () {
    return transport.call(_uri + "copyright");
});

_self.__defineGetter__("description", function () {
    return transport.call(_uri + "description");
});

_self.__defineGetter__("id", function () {
    return transport.call(_uri + "id");
});

_self.__defineGetter__("isForeground", function () {
    return transport.call(_uri + "isForeground");
});

_self.__defineGetter__("license", function () {
    return transport.call(_uri + "license");
});

_self.__defineGetter__("licenseURL", function () {
    return transport.call(_uri + "licenseURL");
});

_self.__defineGetter__("name", function () {
    return transport.call(_uri + "name");
});

_self.__defineGetter__("version", function () {
    return transport.call(_uri + "version");
});

module.exports = _self;
