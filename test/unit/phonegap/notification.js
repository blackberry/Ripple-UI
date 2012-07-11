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
describe("phonegap notifications", function () {
    var notification = require('ripple/platform/phonegap/1.0.0/notification'),
        goodVibrations = require('ripple/ui/plugins/goodVibrations'),
        notifications = require('ripple/notifications');

    beforeEach(function () {
        spyOn(console, "log");
    });

    it("it calls into the UI to vibrate the device", function () {
        spyOn(goodVibrations, "vibrateDevice");
        notification.vibrate(500);
        expect(goodVibrations.vibrateDevice).toHaveBeenCalledWith(500);
    });

    it("it opens a notification with the supplied message", function () {
        spyOn(notifications, "openNotification");
        notification.alert("His name was Robert Paulson");
        expect(notifications.openNotification).toHaveBeenCalledWith("normal",
                        "His name was Robert Paulson");
    });
});
