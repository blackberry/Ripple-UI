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
describe("wac_DeviceStateInfo", function () {
    var DeviceStateInfo = require('ripple/platform/wac/1.0/DeviceStateInfo'),
        sinon = require('sinon'),
        event = require('ripple/event'),
        deviceSettings = require('ripple/deviceSettings'),
        platform = require('ripple/platform'),
        _console = require('ripple/console'),
        s;

    beforeEach(function () {
        spyOn(_console, "log");
        s = sinon.sandbox.create();
        spyOn(platform, "current").andReturn({
            name: "default",
            device: {
                DeviceStateInfo: {
                    language: {control: {value: "en"}},
                    availableMemory: {control: {value: 256}}
                }
            }
        });

        deviceSettings.initialize();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    describe("language", function () {
        it("should return the default control value", function () {
            expect(DeviceStateInfo.language).toEqual("en");
        });

        it("should return the current 'persisted' device's language", function () {
            deviceSettings.register("DeviceStateInfo.availableMemory", 66666);
            var value = DeviceStateInfo.availableMemory;
            expect(value).toEqual(66666);
        });
    });

    describe("availableMemory", function () {
        it("should return the current device's available memory", function () {
            var value = DeviceStateInfo.availableMemory;
            expect(value).toBeGreaterThan(0);
        });

        it("should return the current 'persisted' device's available memory", function () {
            deviceSettings.register("DeviceStateInfo.availableMemory", 66666);
            var value = DeviceStateInfo.availableMemory;
            expect(value).toEqual(66666);
        });
    });

    describe("keypadLightOn", function () {
        it("should return the current 'persisted' device's key pad on boolean", function () {
            deviceSettings.register("DeviceStateInfo.keypadLightOn", true);
            var value = DeviceStateInfo.keypadLightOn;
            expect(value).toBeTruthy();
        });

        it("should return the current 'persisted' device's back light on boolean", function () {
            deviceSettings.register("DeviceStateInfo.backLightOn", true);
            var value = DeviceStateInfo.backLightOn;
            expect(value).toBeTruthy();
        });
    });

    describe("requestPositionInfo", function () {
        it("validates argument length", function () {
            expect(function () {
                DeviceStateInfo.requestPositionInfo();
            }).toThrow();
        });

        it("validates argument", function () {
            expect(function () {
                DeviceStateInfo.requestPositionInfo("abcdef");
            }).toThrow();
        });

        it("accepts expected argument", function () {
            expect(function () {
                DeviceStateInfo.requestPositionInfo("");
                DeviceStateInfo.requestPositionInfo("gps");
            }).toThrow();
        });

        it("calls onPositionRetrieved with empty positionInfo when time out", function () {
            runs(function () {
                var geo = require('ripple/geo'),
                    utils = require('ripple/utils'),
                    origTimeout = geo.timeout;

                geo.timeout = true;

                DeviceStateInfo.onPositionRetrieved = function (pos) {
                    expect(pos).toBeDefined();

                    utils.forEach(pos, function (prop) {
                        expect(prop).not.toBeDefined();
                    });
                };

                DeviceStateInfo.requestPositionInfo("gps");
                geo.timeout = origTimeout;
            });
        });
    });

    describe("audioPath", function () {
        it("should return the current 'persisted' device's audio path", function () {
            deviceSettings.register("DeviceStateInfo.audioPath", "WHATUP");
            var value = DeviceStateInfo.audioPath;
            expect(value).toEqual("WHATUP");
        });
    });

    describe("processorUtilizationPercent", function () {
        it("should return the current 'persisted' cpu percentage", function () {
            deviceSettings.register("DeviceStateInfo.processorUtilizationPercent", "500%");
            var value = DeviceStateInfo.processorUtilizationPercent;
            expect(value).toEqual("500%");
        });
    });

    describe("onScreenChangeDimensions", function () {
        it("should fire when the screen changes dimensions", function () {
            DeviceStateInfo.onScreenChangeDimensions = s.mock().once().withExactArgs(480, 800);
            event.trigger("ScreenChangeDimensions", [480, 800]);
            waits(1);
            runs(function () {
                DeviceStateInfo.onScreenChangeDimensions = null;
            });
        });
    });
});
