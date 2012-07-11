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
var _prompt = require('ripple/ui/plugins/exec-dialog');

module.exports = {
    exec: function (success, fail, service, action, args) {
        var emulator = {
            "Accelerometer": require('ripple/platform/cordova/2.0.0/bridge/accelerometer'),
            "Compass": require('ripple/platform/cordova/2.0.0/bridge/compass'),
            "Camera": require('ripple/platform/cordova/2.0.0/bridge/camera'),
            "Capture": require('ripple/platform/cordova/2.0.0/bridge/capture'),
            "Contacts": require('ripple/platform/cordova/2.0.0/bridge/contacts'),
            "Debug Console": require('ripple/platform/cordova/2.0.0/bridge/console'),
            "Device": require('ripple/platform/cordova/2.0.0/bridge/device'),
            "File": require('ripple/platform/cordova/2.0.0/bridge/file'),
            "Geolocation": require('ripple/platform/cordova/2.0.0/bridge/geolocation'),
            "Media": require('ripple/platform/cordova/2.0.0/bridge/media'),
            "Network Status": require('ripple/platform/cordova/2.0.0/bridge/network'),
            "NetworkStatus": require('ripple/platform/cordova/2.0.0/bridge/network'),
            "Notification": require('ripple/platform/cordova/2.0.0/bridge/notification')
        };

        try {
            emulator[service][action](success, fail, args);
        }
        catch (e) {
            console.log("missing exec:" + service + "." + action);
            console.log(args);
            console.log(e);
            console.log(e.stack);
            //TODO: this should really not log the above lines, but they are very nice for development right now
            _prompt.show(service, action, success, fail);
        }
    }
};
