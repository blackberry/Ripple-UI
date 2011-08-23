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
var constants = require('ripple/constants'),
    db = require('ripple/db');

module.exports = {
    isLocalRequest: function (url) {
        return (!!(url.match(constants.REGEX.LOCAL_URI)) || !url.match(constants.REGEX.EXTERNAL_URI)) || !!(location.host && url.match(location.host));
    },

    proxyEnabled: function () {
        var isDisabled = db.retrieve(constants.XHR.PROXY_DISABLED_BUTTON);
        return !isDisabled || isDisabled === "false" ? true : false;
    }
};
