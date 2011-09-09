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
describe("phonegap_notifications", function () {
    var s,
        sinon = require('sinon'),
        notification = require('ripple/platform/phonegap/1.0/notification'),
        goodVibrations = require('ripple/ui/plugins/goodVibrations'),
        ui = require('ripple/ui'),
        constants = require('ripple/constants'),
        notifications = require('ripple/notifications'),
        platform = require('ripple/platform');

    beforeEach(function () {
        spyOn(console, "log");
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("it calls into the UI to vibrate the device", function () {
        s.mock(goodVibrations).expects("vibrateDevice").withExactArgs(500).once();
        notification.vibrate(500);
    });

    it("it opens a notification with the supplied message", function () {
        s.mock(notifications).expects("openNotification")
         .withExactArgs("normal",
                        "His name was Robert Paulson").once();

        notification.alert("His name was Robert Paulson");
    });
});
