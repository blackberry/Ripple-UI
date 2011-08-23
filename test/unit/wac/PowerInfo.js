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
describe("wac_PowerInfo", function () {
    var PowerInfo = require('ripple/platform/wac/1.0/PowerInfo'),
        deviceSettings = require('ripple/deviceSettings'),
        event = require('ripple/event'),
        _console = require('ripple/console'),
        platform = require('ripple/platform');

    beforeEach(function () {
        spyOn(_console, "error");
        spyOn(_console, "log");
        spyOn(platform, "current").andReturn({
            name: "whatup",
            device: {
                "PowerInfo": {
                    "isCharging": {control: {value: false}},
                    "percentRemaining": {control: {value: 98}}
                }
            }
        });
    });

    it("isCharging should return default control value", function () {
        expect(PowerInfo.isCharging).toEqual(false);
    });

    it("percentRemaining returns default control value", function () {
        expect(PowerInfo.percentRemaining).toEqual(98);
    });

    it("isCharging state change invokes onChargeStateChange", function () {
        spyOn(deviceSettings, "retrieve").andReturn(50);
        PowerInfo.onChargeStateChange = jasmine.createSpy();

        event.trigger("DeviceBatteryStateChanged", [], true);

        expect(PowerInfo.onChargeStateChange).toHaveBeenCalled();
        delete PowerInfo.onChargeStateChange;
    });

    it("isCharging state change invokes onChargeStateChange with discharging", function () {
        spyOn(deviceSettings, "retrieve").andReturn(30);
        PowerInfo.onChargeStateChange = jasmine.createSpy();

        event.trigger("DeviceBatteryStateChanged", [true], true);

        expect(PowerInfo.onChargeStateChange).toHaveBeenCalledWith("charging");
        delete PowerInfo.onChargeStateChange;
    });

    it("onChargeStateChange invokes properly when changing to 100 percent battery level", function () {
        spyOn(deviceSettings, "retrieve").andReturn(100);
        PowerInfo.onChargeStateChange = jasmine.createSpy();

        event.trigger("DeviceBatteryStateChanged", [true], true);

        expect(PowerInfo.onChargeStateChange).toHaveBeenCalledWith("full");
        delete PowerInfo.onChargeStateChange;
    });

    it("onChargeStateChange invokes properly when changing from 100 percent battery level", function () {
        spyOn(deviceSettings, "retrieve").andReturn(99);
        PowerInfo.onChargeStateChange = jasmine.createSpy();

        event.trigger("DeviceBatteryStateChanged", [false], true);

        expect(PowerInfo.onChargeStateChange).toHaveBeenCalledWith("discharging");
        delete PowerInfo.onChargeStateChange;
    });

    it("percentRemaining update invokes onChargeLevelChange with proper args", function () {
        spyOn(deviceSettings, "retrieve").andReturn(99);
        PowerInfo.onChargeLevelChange = jasmine.createSpy();

        event.trigger("DeviceBatteryLevelChanged", [5], true);

        expect(PowerInfo.onChargeLevelChange).toHaveBeenCalledWith(5);
        delete PowerInfo.onChargeLevelChange;
    });

    it("percentRemaining should invoke onLowBattery when below ten percent", function () {
        spyOn(deviceSettings, "retrieve").andReturn(99);
        PowerInfo.onLowBattery = jasmine.createSpy();

        event.trigger("DeviceBatteryLevelChanged", [7], true);

        expect(PowerInfo.onLowBattery).toHaveBeenCalledWith(7);
        delete PowerInfo.onLowBattery;
    });
});
