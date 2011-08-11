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
describe("webworks.tablet system event", function () {
    var sysEvent = require('ripple/platform/webworks.tablet/2.0.0/server/systemEvent'),
        client = require('ripple/platform/webworks.tablet/2.0.0/client/systemEvent'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport');

    describe("platform spec", function () {
        it("includes the module according to proper object structure", function () {
            var spec = require('ripple/platform/webworks.tablet/2.0.0/spec');
            expect(spec.objects.blackberry.children.system.children.event.path)
                .toEqual("webworks.tablet/2.0.0/client/systemEvent");
        });
    });

    describe("server index", function () {
        it("exposes the system event module", function () {
            var webworks = require('ripple/platform/webworks.tablet/2.0.0/server');
            expect(webworks.blackberry.system.event).toEqual(sysEvent);
        });
    });

    // TODO: test the callback logic when polling
    describe("client", function () {
        describe("deviceBatteryLevelChange", function () {
            it("polls the transport appropriately", function () {
                var listener = function () {},
                    args;

                spyOn(transport, "poll");
                client.deviceBatteryLevelChange(listener);
                args = transport.poll.argsForCall[0];

                expect(args[0]).toEqual("blackberry/system/event/deviceBatteryLevelChange");
                expect(args[1]).toEqual({get: {}});
                expect(typeof args[2]).toEqual("function");
            });
        });
    });
});
