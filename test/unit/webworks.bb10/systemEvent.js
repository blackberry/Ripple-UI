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
describe("webworks.bb10 system event", function () {
    var server = require('ripple/platform/webworks.bb10/1.0.0/client/systemEvent'),
        deviceSpec = require('ripple/platform/webworks.bb10/1.0.0/spec/device'),
        event = require('ripple/event');

    describe("in the device spec", function () {
        it("includes setting to toggle handset charging on and off", function () {
            expect(typeof deviceSpec.battery.state.name).toEqual("string");
            expect(deviceSpec.battery.state.control.type).toEqual("checkbox");

            expect(typeof deviceSpec.battery.level.callback).toEqual("function");
            spyOn(event, "trigger");
            deviceSpec.battery.state.callback(false);
            expect(event.trigger).toHaveBeenCalledWith("DeviceBatteryStateChanged", [false]);
        });

        it("includes setting to set charge level of the handset", function () {
            expect(typeof deviceSpec.battery.level.name).toEqual("string");
            expect(deviceSpec.battery.level.control.type).toEqual("select");
            expect(typeof deviceSpec.battery.level.options === "object").toEqual(true);

            expect(typeof deviceSpec.battery.level.callback).toEqual("function");
            spyOn(event, "trigger");
            deviceSpec.battery.level.callback(87);
            expect(event.trigger).toHaveBeenCalledWith("DeviceBatteryLevelChanged", [87]);
        });
    });

    describe("server", function () {
        beforeEach(function () {
            spyOn(console, "log");
        });

        describe("deviceBatteryStateChange", function () {

            it("calls the callback when DeviceBatteryStateChanged is emitted", function () {
                var cb = new jasmine.createSpy();
                server.deviceBatteryStateChange(cb);
                event.trigger("DeviceBatteryStateChanged", [], true);
                expect(cb).toHaveBeenCalled();
            });

            it("passes state UNPLUGGED when charging is false", function () {
                var cb = new jasmine.createSpy();
                server.deviceBatteryStateChange(cb);
                event.trigger("DeviceBatteryStateChanged", [false], true);
                expect(cb).toHaveBeenCalledWith(3); // state CHARGING
            });

            it("passes state CHARGING when charging is true", function () {
                var cb = new jasmine.createSpy();
                server.deviceBatteryStateChange(cb);
                event.trigger("DeviceBatteryStateChanged", [true], true);
                expect(cb).toHaveBeenCalledWith(2); // state UNPLUGGED
            });

            it("passes state FULL when battery level is 100", function () {
                var cb = new jasmine.createSpy();
                server.deviceBatteryStateChange(cb);
                event.trigger("DeviceBatteryLevelChanged", [100], true);
                expect(cb).toHaveBeenCalledWith(1); // state FULL
            });

            it("also passes state FULL when given a String for battery level", function () {
                var cb = new jasmine.createSpy();
                server.deviceBatteryStateChange(cb);
                event.trigger("DeviceBatteryLevelChanged", ["100"], true);
                expect(cb).toHaveBeenCalledWith(1);
            });
        });

        describe("deviceBatteryLevelChange", function () {
            it("calls the callback when battery level changes", function () {
                var cb = new jasmine.createSpy();
                server.deviceBatteryLevelChange(cb);
                event.trigger("DeviceBatteryLevelChanged", [80], true);
                expect(cb).toHaveBeenCalledWith(80);
            });
        });
    });
});
