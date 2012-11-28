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
var event = ripple('event'),
    _onCoverageChange,
    _onHardwareKey = {};

event.on("CoverageChange", function () {
    var baton = _onCoverageChange;
    _onCoverageChange = null;
    return baton && baton.pass({code: 1});
});

event.on("HardwareKey", function (key) {
    var baton = _onHardwareKey["key_" + key];
    delete _onHardwareKey["key_" + key];

    if (baton) {
        baton.pass({code: 1});
    }
    else {
        event.trigger("HardwareKeyDefault", [key]);
    }
});

module.exports = {
    onCoverageChange: function (args, post, baton) {
        baton.take();
        _onCoverageChange = baton;
    },

    onHardwareKey: function (args, post, baton) {
        baton.take();
        _onHardwareKey["key_" + args.key] = baton;
    }
};
