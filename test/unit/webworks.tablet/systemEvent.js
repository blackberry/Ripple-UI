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
    var server = require('ripple/platform/webworks.tablet/2.0.0/server/systemEvent'),
        client = require('ripple/platform/webworks.tablet/2.0.0/client/systemEvent'),
        spec = require('ripple/platform/webworks.tablet/2.0.0/spec/device'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        event = require('ripple/event'),
        MockBaton = function () {
            this.take = jasmine.createSpy('baton.take');
            this.pass = jasmine.createSpy('baton.pass');
        };

    describe("platform spec", function () {
        // NOTE: system and system.event for Playbook do not require feature declarations (see docs)
        it("includes the module according to proper object structure", function () {
            var spec = require('ripple/platform/webworks.tablet/2.0.0/spec');
            expect(spec.objects.blackberry.children.system.children.event.path)
                .toEqual("webworks.tablet/2.0.0/client/systemEvent");
        });
    });

    describe("server index", function () {
        it("exposes the system event module", function () {
            var webworks = require('ripple/platform/webworks.tablet/2.0.0/server');
            expect(webworks.blackberry.system.event).toEqual(server);
        });
    });

    describe("in the device spec", function () {
        it("includes setting to togger handset charging on and off", function () {
            expect(typeof spec.battery.state.name).toEqual("string");
            expect(spec.battery.state.control.type).toEqual("checkbox");

            expect(typeof spec.battery.level.callback).toEqual("function");
            spyOn(event, "trigger");
            spec.battery.state.callback(false);
            expect(event.trigger).toHaveBeenCalledWith("DeviceBatteryStateChanged", [false]);
        });

        it("includes setting to set charge level of the handset", function () {
            expect(typeof spec.battery.level.name).toEqual("string");
            expect(spec.battery.level.control.type).toEqual("select");
            expect(typeof spec.battery.level.options === "object").toEqual(true);

            expect(typeof spec.battery.level.callback).toEqual("function");
            spyOn(event, "trigger");
            spec.battery.level.callback(87);
            expect(event.trigger).toHaveBeenCalledWith("DeviceBatteryLevelChanged", [87]);
        });
    });

    describe("client", function () {
        describe("deviceBatteryStateChange", function () {
            it("polls the transport appropriately", function () {
                var listener = function () {},
                    args;

                spyOn(transport, "poll");
                client.deviceBatteryStateChange(listener);
                args = transport.poll.argsForCall[0];

                expect(args[0]).toEqual("blackberry/system/event/deviceBatteryStateChange");
                expect(args[1]).toEqual({});
                expect(typeof args[2]).toEqual("function");
            });

            it("invokes handler upon successfull response from server", function () {
                var listener = jasmine.createSpy(),
                    res = {
                        code: 1,
                        data: 3 // state UNPLUGGED
                    },
                    returnPoll;

                spyOn(transport, "poll");
                client.deviceBatteryStateChange(listener);

                returnPoll = transport.poll.argsForCall[0][2];
                returnPoll(res.data, JSON.stringify(res));

                expect(listener).toHaveBeenCalledWith(res.data);
            });
        });

        describe("deviceBatteryLevelChange", function () {
            it("polls the transport appropriately", function () {
                var listener = function () {},
                    args;

                spyOn(transport, "poll");
                client.deviceBatteryLevelChange(listener);
                args = transport.poll.argsForCall[0];

                expect(args[0]).toEqual("blackberry/system/event/deviceBatteryLevelChange");
                expect(args[1]).toEqual({});
                expect(typeof args[2]).toEqual("function");
            });

            it("invokes handler upon successfull response from server", function () {
                var listener = jasmine.createSpy(),
                    res = {
                        code: 1,
                        data: 80
                    },
                    returnPoll;

                spyOn(transport, "poll");
                client.deviceBatteryLevelChange(listener);

                returnPoll = transport.poll.argsForCall[0][2];
                returnPoll(res.data, JSON.stringify(res));

                expect(listener).toHaveBeenCalledWith(res.data);
            });
        });
    });

    describe("server", function () {
        beforeEach(function () {
            spyOn(console, "log");
        });

        describe("deviceBatteryStateChange", function () {
            it("takes the baton when polled", function () {
                var baton = new MockBaton();
                server.deviceBatteryStateChange({}, {}, baton);
                expect(baton.take).toHaveBeenCalled();
            });

            it("passes the baton when DeviceBatteryStateChanged is emitted", function () {
                var baton = new MockBaton();
                server.deviceBatteryStateChange({}, {}, baton);
                event.trigger("DeviceBatteryStateChanged", [], true);
                expect(baton.pass).toHaveBeenCalled();
            });

            it("only passed the baton once", function () {
                var baton = new MockBaton();
                server.deviceBatteryStateChange({}, {}, baton);
                event.trigger("DeviceBatteryStateChanged", [], true);
                event.trigger("DeviceBatteryStateChanged", [], true);
                expect(baton.pass).toHaveBeenCalled();
            });

            it("passes state UNPLUGGED when charging is false", function () {
                var baton = new MockBaton();
                server.deviceBatteryStateChange({}, {}, baton);
                event.trigger("DeviceBatteryStateChanged", [false], true);
                expect(baton.pass).toHaveBeenCalledWith({code: 1, data: 3}); // state CHARGING
            });

            it("passes state CHARGING when charging is false", function () {
                var baton = new MockBaton();
                server.deviceBatteryStateChange({}, {}, baton);
                event.trigger("DeviceBatteryStateChanged", [true], true);
                expect(baton.pass).toHaveBeenCalledWith({code: 1, data: 2}); // state UNPLUGGED
            });

            it("passes state FULL when battery level is 100", function () {
                var baton = new MockBaton();
                server.deviceBatteryStateChange({}, {}, baton);
                event.trigger("DeviceBatteryLevelChanged", [100], true);
                expect(baton.pass).toHaveBeenCalledWith({code: 1, data: 1}); // state FULL
            });

            it("also passes state FULL when given a String for battery level", function () {
                var baton = new MockBaton();
                server.deviceBatteryStateChange({}, {}, baton);
                event.trigger("DeviceBatteryLevelChanged", ["100"], true);
                expect(baton.pass).toHaveBeenCalledWith({code: 1, data: 1});
            });
        });

        describe("deviceBatteryLevelChange", function () {
            it("takes the baton when polled", function () {
                var baton = new MockBaton();
                server.deviceBatteryLevelChange({}, {}, baton);
                expect(baton.take).toHaveBeenCalled();
            });

            it("passes the baton when DeviceBatteryLevelChanged is emitted", function () {
                var baton = new MockBaton();
                server.deviceBatteryLevelChange({}, {}, baton);
                event.trigger("DeviceBatteryLevelChanged", [], true);
                expect(baton.pass).toHaveBeenCalled();
            });

            it("only passed the baton once", function () {
                var baton = new MockBaton();
                server.deviceBatteryLevelChange({}, {}, baton);
                event.trigger("DeviceBatteryLevelChanged", [], true);
                event.trigger("DeviceBatteryLevelChanged", [], true);
                expect(baton.pass).toHaveBeenCalled();
            });

            it("passes baton when battery level changes", function () {
                var baton = new MockBaton();
                server.deviceBatteryLevelChange({}, {}, baton);
                event.trigger("DeviceBatteryLevelChanged", [80], true);
                expect(baton.pass).toHaveBeenCalledWith({code: 1, data: 80});
            });
        });
    });
});
