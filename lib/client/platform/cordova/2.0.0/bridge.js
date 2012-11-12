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
var _prompt = ripple('ui/plugins/exec-dialog');

module.exports = {
    exec: function (success, fail, service, action, args) {
        var emulator = {
            "App": ripple('platform/cordova/2.0.0/bridge/app'),
            "Accelerometer": ripple('platform/cordova/2.0.0/bridge/accelerometer'),
            "Compass": ripple('platform/cordova/2.0.0/bridge/compass'),
            "Camera": ripple('platform/cordova/2.0.0/bridge/camera'),
            "Capture": ripple('platform/cordova/2.0.0/bridge/capture'),
            "Contacts": ripple('platform/cordova/2.0.0/bridge/contacts'),
            "Debug Console": ripple('platform/cordova/2.0.0/bridge/console'),
            "Device": ripple('platform/cordova/2.0.0/bridge/device'),
            "File": ripple('platform/cordova/2.0.0/bridge/file'),
            "Geolocation": ripple('platform/cordova/2.0.0/bridge/geolocation'),
            "Media": ripple('platform/cordova/2.0.0/bridge/media'),
            "Network Status": ripple('platform/cordova/2.0.0/bridge/network'),
            "NetworkStatus": ripple('platform/cordova/2.0.0/bridge/network'),
            "Notification": ripple('platform/cordova/2.0.0/bridge/notification')
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
