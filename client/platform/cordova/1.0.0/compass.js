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
var geo = require('ripple/client/geo');

function _getHeading() {
    return geo.getPositionInfo().heading;
}

module.exports = {
    getCurrentHeading: function (compassSuccess) {
        setTimeout(function () {
            compassSuccess(_getHeading());
        }, 1);
    },
    watchHeading: function (compassSuccess, compassError, compassOptions) {
        compassOptions = compassOptions || {};
        return setInterval(function () {
            compassSuccess(_getHeading());
        }, compassOptions.frequency || 100);
    },
    clearWatch: function (success, error, args) {
        clearInterval(args[0]);
        if (success && typeof (success) === 'function') {
            success();
        }
    }
};
