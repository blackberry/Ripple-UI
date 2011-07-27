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
var exception = require('ripple/exception'),
    _environmentConfiguration = {
        "Production": {
            "apiURL": "http://api.tinyhippos.com"
        },

        "Demo": {
            "apiURL": "http://apidemo.tinyhippos.com"
        },

        "Local": {
            "apiURL": "http://127.0.0.1:4567"
        }
    },
    _environment = "Production";

module.exports = {
    getAPIURL: function () {
        return _environmentConfiguration[_environment].apiURL;
    },

    setEnvironment: function (env) {
        if (!_environmentConfiguration[env]) {
            exception.raise(exception.types.Application, "No configuration found for selected environment: " + env);
        }
        _environment = env;
    }
};
