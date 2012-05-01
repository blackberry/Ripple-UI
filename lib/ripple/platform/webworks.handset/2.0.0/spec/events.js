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
    utils = require('ripple/utils'),
    event = require('ripple/event'),
    events = require('ripple/platform/webworks.core/2.0.0/spec/events');

_self = {
    "system.event.onExit": {
        callback: function () {
            event.trigger("AppExit");
        }
    },
    "system.event.onCoverageChange": {
        callback: function () {
            event.trigger("CoverageChange");
        }
    },
    "system.event.onHardwareKey": {
        args: [
            "Back",
            "Menu",
            "Convenience 1",
            "Convenience 2",
            "Start Call",
            "End Call",
            "Volume Down",
            "Volume Up"
        ],
        callback: function (key) {
            event.trigger("HardwareKey", [key]);
        }
    }
};

utils.mixin(events, _self);

module.exports = _self;
