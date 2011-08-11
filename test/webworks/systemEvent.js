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
describe("webworks system event", function () {
    var sysEvent = require('ripple/platform/webworks.handset/2.0.0/server/systemEvent'),
        client = require('ripple/platform/webworks.handset/2.0.0/client/systemEvent'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        menu = require("ripple/platform/webworks.handset/2.0.0/server/menu"),
        event = require('ripple/event'),
        MockBaton = function () {
            this.take = jasmine.createSpy('baton.take');
            this.pass = jasmine.createSpy('baton.pass');
        };

    describe("using server", function () {
        it("exposes the system event module", function () {
            var webworks = require('ripple/platform/webworks.handset/2.0.0/server');
            expect(webworks.blackberry.system.event).toEqual(sysEvent);
        });
    });

    // TODO: test the callback logic when polling
    describe("client", function () {
        describe("onCoverageChange", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.onCoverageChange(null);
                var args = transport.poll.argsForCall[0];

                expect(args[0]).toEqual("blackberry/system/event/onCoverageChange");
                expect(args[1]).toEqual({get: {}});
                expect(typeof args[2]).toEqual("function");
            });
        });

        describe("onHardwareKey", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.onHardwareKey("key", null);
                var args = transport.poll.argsForCall[0];

                expect(args[0]).toEqual("blackberry/system/event/onHardwareKey");
                expect(args[1]).toEqual({get: {key: "key"}});
                expect(typeof args[2]).toEqual("function");
            });
        });
    });

    describe("onCoverageChange", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();
            sysEvent.onCoverageChange({}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });

        it("passes the baton when CoverageChanged is raised", function () {
            var baton = new MockBaton();
            sysEvent.onCoverageChange({}, {}, baton);
            event.trigger("CoverageChange", [], true);
            expect(baton.pass).toHaveBeenCalledWith({code: 1});
        });

        it("only passes the baton once", function () {
            var baton = new MockBaton();
            sysEvent.onCoverageChange({}, {}, baton);
            event.trigger("CoverageChange", [], true);
            event.trigger("CoverageChange", [], true);
            expect(baton.pass.callCount).toBe(1);
        });
    });

    describe("onHardwareKey", function () {
        //HACK: this is because we don't want other events to be triggered
        //      (HardwareKeyDefault) but we need to trigger HardwareKey
        var trigger = event.trigger;

        beforeEach(function () {
            spyOn(event, "trigger");
        });

        it("takes the baton", function () {
            var baton = new MockBaton();
            sysEvent.onHardwareKey({key: 1}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });

        it("passes the baton when HardwareKey is raised", function () {
            var baton = new MockBaton();
            sysEvent.onHardwareKey({key: 1}, {}, baton);
            trigger("HardwareKey", ['1'], true);
            expect(baton.pass).toHaveBeenCalledWith({code: 1});
        });

        xit("only passes the baton once", function () {
            var baton = new MockBaton();

            sysEvent.onHardwareKey({key: 1}, {}, baton);
            trigger("HardwareKey", ['1'], true);
            trigger("HardwareKey", ['1'], true);
            expect(baton.pass.callCount).toBe(1);
        });

        it("only passes the baton for the given key from the HardwareKey event", function () {
            var b1 = new MockBaton(),
                b2 = new MockBaton();

            sysEvent.onHardwareKey({key: 1}, null, b1);
            sysEvent.onHardwareKey({key: 2}, null, b2);
            trigger("HardwareKey", ['1'], true);

            expect(b1.pass).toHaveBeenCalled();
            expect(b2.pass).not.toHaveBeenCalled();
        });

        it("raises the HardwareKeyDefault event when no baton", function () {

            trigger("HardwareKey", ['3'], true);
            expect(event.trigger).toHaveBeenCalledWith("HardwareKeyDefault", ['3']);
        });
    });
});
