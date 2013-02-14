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
var geo = ripple('geo'),
    bridge = ripple('emulatorBridge'),
    CompassHeading = bridge.window().CompassHeading,
    _success,
    _error,
    _interval;

module.exports = {
    getHeading: function (success) {
        // TODO: build facility to trigger onError() from emulator
        // see pivotal item: https://www.pivotaltracker.com/story/show/7040343

        var heading = new CompassHeading();
        heading.trueHeading = geo.getPositionInfo().heading;
        heading.magneticHeading = geo.getPositionInfo().heading;
        heading.headingAccuracy = 100;
        success(heading);
    },

    stopHeading: function () {
        //do nothing
    },

    start: function (success, error) {
        _success = success;
        _error = error;

        _interval = window.setInterval(function () {
            var heading = new CompassHeading();
            heading.trueHeading = geo.getPositionInfo().heading;
            heading.magneticHeading = geo.getPositionInfo().heading;
            heading.headingAccuracy = 100;
            success(heading);
        }, 50);
    },

    stop: function () {
        _success = null;
        _error = null;
        window.clearInterval(_interval);
    }
};
