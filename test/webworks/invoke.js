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
describe("webworks_invoke", function () {
    var webworks = require('ripple/platform/webworks.handset/2.0.0/server'),
        Invoke = require('ripple/platform/webworks.core/2.0.0/client/invoke'),
        notifications = require('ripple/notifications'),
        constants = require('ripple/constants'),
        sinon = require('sinon'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("raises a notification when calling invoke", function () {
        s.mock(notifications)
            .expects("openNotification")
            .withExactArgs(constants.NOTIFICATIONS.TYPES.NORMAL, "Application requested to launch: http://www.google.com")
            .once();

        webworks.blackberry.invoke.invoke({
            appType: "http://www.google.com"
        });
    });

    it("calls the correct invoke URI", function () {
        spyOn(transport, "call");

        Invoke.invoke(Invoke.APP_BROWSER);

        expect(transport.call).toHaveBeenCalledWith("blackberry/invoke/invoke", {
            get: {
                appType: "http://"
            },
            async: true
        });
    });
});
