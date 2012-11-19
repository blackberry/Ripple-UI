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

describe("webkitBattery", function () {
    var battery = ripple('platform/webworks.bb10/1.0.0/webkitBattery');

    describe("when checking the interface", function () {
        it("has a charging property", function () {
            expect(battery.charging).toBeDefined();
        });

        it("has charging as readonly", function () {
            battery.charging = "I don't want to miss a thing";
            expect(battery.charging).not.toEqual("I don't want to miss a thing");
        });

        it("has a chargingTime property", function () {
            expect(battery.chargingTime).toBeDefined();
        });

        it("has chargingTime as readonly", function () {
            battery.chargingTime = "I can't fight this feeling anymore";
            expect(battery.chargingTime).not.toEqual("I can't fight this feeling anymore");
        });

        it("has a dischargingTime property", function () {
            expect(battery.dischargingTime).toBeDefined();
        });

        it("has dischargingTime as readonly", function () {
            battery.dischargingTime = "You give love a bad name";
            expect(battery.dischargingTime).not.toEqual("You give love a bad name");
        });

        it("has a level property", function () {
            expect(battery.level).toBeDefined();
        });

        it("has level as readonly", function () {
            battery.level = "Sister Christian you know the time has come";
            expect(battery.level).not.toEqual("Sister Christian you know the time has come");
        });

        it("has onchargingchange", function () {
            expect(battery.onchargingchange).toBeDefined();
        });

        it("has onchargingtimechange", function () {
            expect(battery.onchargingtimechange).toBeDefined();
        });

        it("has ondischargingtimechange", function () {
            expect(battery.ondischargingtimechange).toBeDefined();
        });

        it("has onlevelchange", function () {
            expect(battery.onlevelchange).toBeDefined();
        });
    });

    describe("the values come from the device settings", function () {
        var deviceSettings = ripple('deviceSettings');

        it("gets the value for charging", function () {
            spyOn(deviceSettings, "retrieveAsBoolean").andReturn("Leonardo");
            expect(battery.charging).toBe("Leonardo");
            expect(deviceSettings.retrieveAsBoolean).toHaveBeenCalledWith('battery.state');
        });

        it("gets the value for chargingTime", function () {
            spyOn(deviceSettings, "retrieveAsInt").andReturn("Michelangelo");
            expect(battery.chargingTime).toBe("Michelangelo");
            expect(deviceSettings.retrieveAsInt).toHaveBeenCalledWith('battery.chargingTime');
        });

        it("gets the value for dischargingTime", function () {
            spyOn(deviceSettings, "retrieveAsInt").andReturn("Donatello");
            expect(battery.dischargingTime).toBe("Donatello");
            expect(deviceSettings.retrieveAsInt).toHaveBeenCalledWith('battery.dischargingTime');
        });

        it("gets the value for level", function () {
            spyOn(deviceSettings, "retrieveAsInt").andReturn(55);
            expect(battery.level).toBe(0.55);
            expect(deviceSettings.retrieveAsInt).toHaveBeenCalledWith('battery.level');
        });
    });

    describe("when subscribing to events", function () {
        var event = ripple('event');

        describe("and using the onX properties", function () {
            it("calls the onlevelchange function on the DeviceBatteryLevelChanged event", function () {
                battery.onlevelchange = jasmine.createSpy("onlevelchange");
                event.trigger("DeviceBatteryLevelChanged", [12], true);
                expect(battery.onlevelchange).toHaveBeenCalledWith();
                battery.onlevelchange = null;
            });

            it("calls the onchargingtimechange function on the DeviceBatteryChargingTimeChanged event", function () {
                battery.onchargingtimechange = jasmine.createSpy("onchargingtimechange");
                event.trigger("DeviceBatteryChargingTimeChanged", [12222], true);
                expect(battery.onchargingtimechange).toHaveBeenCalledWith();
                battery.onchargingtimechange = null;
            });

            it("calls the ondischargingtimechange function on the DeviceBatteryDischargingTimeChanged event", function () {
                battery.ondischargingtimechange = jasmine.createSpy("ondischargingtimechange");
                event.trigger("DeviceBatteryDischargingTimeChanged", [false], true);
                expect(battery.ondischargingtimechange).toHaveBeenCalledWith();
                battery.ondischargingtimechange = null;
            });

            it("calls the onchargingchange function on the DeviceBatteryStateChanged event", function () {
                battery.onchargingchange = jasmine.createSpy("onchargingchange");
                event.trigger("DeviceBatteryStateChanged", [false], true);
                expect(battery.onchargingchange).toHaveBeenCalledWith();
                battery.onchargingchange = null;
            });
        });

        describe("and using the addEventListener", function () {
            var calls = function (e, rippleEvent) {
                var cb = jasmine.createSpy(e);
                battery.addEventListener(e, cb);
                event.trigger(rippleEvent, [12], true);
                expect(cb).toHaveBeenCalledWith();
            };

            it("can call with no args", function () {
                expect(battery.addEventListener).not.toThrow();
            });

            it("can call with no callback and no problems", function () {
                battery.addEventListener("levelchange");
                expect(function () {
                    event.trigger("DeviceBatteryLevelChanged", [12], true);
                }).not.toThrow();
            });

            it("can call with a unknown event type", function () {
                expect(function () {
                    battery.addEventListener("click", jasmine.createSpy());
                }).not.toThrow();
            });

            it("calls the callback given for levelchange", function () {
                calls("levelchange", "DeviceBatteryLevelChanged");
            });

            it("calls the callback given for chargingtimechange", function () {
                calls("chargingtimechange", "DeviceBatteryChargingTimeChanged");
            });

            it("calls the callback given for chargingchange", function () {
                calls("chargingchange", "DeviceBatteryStateChanged");
            });

            it("calls the callback given for dischargingtimechange", function () {
                calls("dischargingtimechange", "DeviceBatteryDischargingTimeChanged");
            });

            it("can register the same function twice but is only called once", function () {
                var cb = jasmine.createSpy("levelchange");
                battery.addEventListener("levelchange", cb);
                battery.addEventListener("levelchange", cb);
                event.trigger("DeviceBatteryLevelChanged", [12], true);
                expect(cb.callCount).toBe(1);
            });

            it("can remove a handler and it isn't called", function () {
                var cb = jasmine.createSpy("levelchange");
                battery.addEventListener("levelchange", cb);
                battery.removeEventListener("levelchange", cb);
                event.trigger("DeviceBatteryLevelChanged", [12], true);
                expect(cb.callCount).toBe(0);
            });

            it("can call remove with no args", function () {
                expect(battery.removeEventListener).not.toThrow();
            });

            it("can call remove for an unknown event type", function () {
                expect(function () {
                    battery.removeEventListener("click", jasmine.createSpy());
                }).not.toThrow();
            });

            it("can call remove for a callback that wasn't registered", function () {
                expect(function () {
                    battery.removeEventListener("levelchange", jasmine.createSpy());
                }).not.toThrow();
            });
        });
    });
});
