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
describe("vodafone_DeviceStateInfo", function () {
    var DeviceStateInfo = require('ripple/platform/vodafone/2.7/DeviceStateInfo'),
        sinon = require('sinon'),
        deviceSettings = require('ripple/deviceSettings'),
        platform = require('ripple/platform'),
        event = require('ripple/event'),
        _console = require('ripple/console'),
        s;

    beforeEach(function () {
        spyOn(_console, "log");
        s = sinon.sandbox.create();
        spyOn(platform, "current").andReturn({
            name: "default",
            device: {
                DeviceStateInfo: {
                    language: { control: { value: "en" } },
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
            deviceSettings.register("DeviceStateInfo.language", "fr");
            var value = DeviceStateInfo.language;
            expect(value).toEqual("fr");
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

        it("onPositionRetrieved is called with empty positionInfo when time out", function () {
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

        it("onScreenChangeDimensions should not fire when the screen changes dimensions", function () {
            DeviceStateInfo.onScreenChangeDimensions = jasmine.createSpy();
            event.trigger("ScreenChangeDimensions", [480, 800]);
            waits(1);
            runs(function () {
                expect(DeviceStateInfo.onScreenChangeDimensions).not.toHaveBeenCalled();
                DeviceStateInfo.onScreenChangeDimensions = null;
            });
        });
    });
});
