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
describe("webworks_appEvent", function () {
    var appEvent = require('ripple/platform/webworks.bb10/1.0.0/server/appEvent'),
        client = require('ripple/platform/webworks.bb10/1.0.0/client/appEvent'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        event = require('ripple/event'),
        MockBaton = function () {
            this.take = jasmine.createSpy('baton.take');
            this.pass = jasmine.createSpy('baton.pass');
        };

    describe("client", function () {
        // TODO: test the callback logic in polling
        describe("onExit", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.onExit(null);
                expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/app/event/onExit");
                expect(transport.poll.argsForCall[0][1]).toEqual({});
                expect(typeof transport.poll.argsForCall[0][2]).toEqual("function"); 
            });
        });

    });

    describe("onExit", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();

            appEvent.onExit({}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });
    });
});
