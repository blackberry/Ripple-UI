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
var constants = require('ripple/constants');

module.exports = {
    vibrateDevice: function (milliseconds) {
        var node = jQuery("#" + constants.COMMON.DEVICE_CONTAINER),
            x, times;

        times = Math.floor(milliseconds / 100);

        for (x = 1; x <= times; x++) {
            node.animate({ left: -10 }, 5)
            .animate({ left: 0 }, 1)
            .animate({ left: 10 }, 5)
            .animate({ left: 0 }, 1);

            node.animate({ top: -10 }, 5)
            .animate({ top: 0 }, 1)
            .animate({ top: 10 }, 5)
            .animate({ top: 0 }, 1);
        }
    },
    shakeDevice: function (times) {
        var node = jQuery("#" + constants.COMMON.DEVICE_CONTAINER),
            x;

        for (x = 1; x <= times; x++) {
            node.animate({ left: -25 }, 50)
            .animate({ left: 0 }, 30)
            .animate({ left: 25 }, 50)
            .animate({ left: 0 }, 30);
        }
    }
};
