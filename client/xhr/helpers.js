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
var constants = require('ripple/client/constants'),
    db = require('ripple/client/db'),
    PROXY_SETTINGS_LIST = constants.XHR.PROXY_SETTINGS_LIST,
    _self;

_self = {
    isLocalRequest: function (url) {
        return (!!(url.match(constants.REGEX.LOCAL_URI)) || !url.match(constants.REGEX.EXTERNAL_URI)) ||
                !!(location.host && url.match(location.host));
    },

    proxyEnabled: function () {
        return db.retrieve(constants.XHR.PROXY_SETTING) !== PROXY_SETTINGS_LIST.disabled;
    },

    proxyIsRemote: function () {
        var proxySetting = db.retrieve(constants.XHR.PROXY_SETTING);

        // if no setting, it is assumed proxy is remote
        return _self.proxyEnabled() && (proxySetting ? proxySetting === PROXY_SETTINGS_LIST.remote : true);
    },

    localProxyRoute: function () {
        // Note: if calling from `file://` then explicitly use `http://localhost`, else use location's values.
        var route;
        route = db.retrieve(constants.XHR.LOCAL_PROXY_ROUTE_SETTING);
        return "http://localhost:" +
               (db.retrieve(constants.XHR.LOCAL_PROXY_PORT_SETTING) || constants.XHR.DEFAULT_LOCAL_PORT) +
               (route || route === "" ? route : constants.XHR.DEFAULT_LOCAL_ROUTE);
    }
};

module.exports = _self;
