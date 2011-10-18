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
describe("devices", function () {
    var devices = require('ripple/devices'),
        platform = require('ripple/platform'),
        event = require('ripple/event'),
        emulatorBridge = require('ripple/emulatorBridge'),
        db = require('ripple/db');

    beforeEach(function () {
        spyOn(db, "retrieveObject");
        spyOn(db, "saveObject");
        spyOn(platform, "current").andReturn({id: "phonegap", version: "1.0"});
        devices.initialize();
    });

    it("getDevice returns a copied device object", function () {
        var device = devices.getDevice("iPhone3"),
            originalDevice;
        device.name = "test device";
        originalDevice = devices.getDevice("iPhone3");
        expect(device.name).not.toBe(originalDevice.name);
    });

    it("getCurrentDevice should return an object", function () {
        expect(devices.getCurrentDevice()).toBeDefined();
    });

    it("getDevice should return overridden device values for platform and version", function () {
        //HACK this is a integration test
        devices.getDevice("iPhone3", "phonegap", "0.9");
    });

    it("getDevice should return device with device.overrides if API param not provided", function () {
        var device = devices.getDevice("iPhone3");
        expect(device.overrides).not.toEqual(undefined);
    });

    it("getDevice should return null when a device is not found", function () {
        expect(devices.getDevice("jkfhlsdklfjsdf")).toEqual(null);
    });

    describe("when HardwareKeyDefault is raised", function () {
        var _window;

        beforeEach(function () {
            _window = {
                history: {
                    back: jasmine.createSpy("window.history.back")
                }
            };
            spyOn(emulatorBridge, "window").andReturn(_window);
        });

        it("calls history.back when the key is 0", function () {
            event.trigger("HardwareKeyDefault", ["0"], true);
            expect(_window.history.back).toHaveBeenCalled();
        });

        it("doesn't callhistory.back when the key is not 0", function () {
            event.trigger("HardwareKeyDefault", ["2"], true);
            expect(_window.history.back).not.toHaveBeenCalled();
        });
    });
});
