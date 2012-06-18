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
            "Accelerometer": require('ripple/platform/cordova/1.6/bridge/accelerometer'),
            "Compass": require('ripple/platform/cordova/1.6/bridge/compass'),
            "Contacts": require('ripple/platform/cordova/1.6/bridge/contacts'),
            "Device": require('ripple/platform/cordova/1.6/bridge/device'),
            "Geolocation": require('ripple/platform/cordova/1.6/bridge/geolocation'),
            "Network Status": require('ripple/platform/cordova/1.6/bridge/network'),
            "NetworkStatus": require('ripple/platform/cordova/1.6/bridge/network'),
            "Notification": require('ripple/platform/cordova/1.6/bridge/notification')
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
