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
module.exports = {
    "cordova": {
        "1.0.0": require('ripple/client/platform/cordova/1.0.0/spec'),
        "2.0.0": require('ripple/client/platform/cordova/2.0.0/spec')
    },
    "webworks.bb10": { "1.0.0": require('ripple/client/platform/webworks.bb10/1.0.0/spec') },
    "webworks.handset": { "2.0.0": require('ripple/client/platform/webworks.handset/2.0.0/spec') },
    "webworks.tablet": { "2.0.0": require('ripple/client/platform/webworks.tablet/2.0.0/spec') },
    "web": { "default": require('ripple/client/platform/web/default/spec') },
    "get": function (name, version) {
        var platform = module.exports[name] || {};
        return (platform[version] || platform[Object.keys(platform)[0]]);
    }
};
