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
describe("wac_DeviceInfo", function () {

    var DeviceInfo = require('ripple/platform/wac/1.0/DeviceInfo'),
        deviceSettings = require('ripple/deviceSettings'),
        platform = require('ripple/platform'),
        devices = require('ripple/devices'),
        HVGA = require('ripple/devices/HVGA');

    beforeEach(function () {
        spyOn(platform, "current").andReturn({
            device: {
                "DeviceInfo": {
                    "phoneColorDepthDefault": {control: {value: 32}},
                    "totalMemory": {control: {value: 128}}
                }
            }
        });
    });

    it("phoneColorDepthDefault returns the current default color depth", function () {
        var value = DeviceInfo.phoneColorDepthDefault;
        expect(value).toEqual(32);
    });

    it("phoneColorDepthDefault returns the current 'persisted' device's default color depth", function () {
        deviceSettings.register("DeviceInfo.phoneColorDepthDefault", 545454);
        expect(DeviceInfo.phoneColorDepthDefault).toEqual(545454);
    });

    it("totalMemory returns the current device's memory", function () {
        expect(DeviceInfo.totalMemory).toEqual(128);
    });

    it("totalMemory returns the current registered device total memory", function () {
        deviceSettings.register("DeviceInfo.totalMemory", 6666);
        expect(DeviceInfo.totalMemory).toEqual(6666);
    });

    it("phoneOS returns the current device's os", function () {
        spyOn(devices, "getCurrentDevice").andReturn(HVGA);
        expect(DeviceInfo.phoneOS).toEqual(HVGA.osName + " " + HVGA.osVersion);
    });

    it("phoneManufacturer returns the current device's manufacturer", function () {
        spyOn(devices, "getCurrentDevice").andReturn(HVGA);
        expect(DeviceInfo.phoneManufacturer).toEqual(HVGA.manufacturer);
    });

    it("phoneFirmware returns the current device's os firmware version", function () {
        spyOn(devices, "getCurrentDevice").andReturn(HVGA);
        expect(DeviceInfo.phoneFirmware).toEqual(HVGA.firmware);
    });

    it("phoneModel returns the current device's model", function () {
        spyOn(devices, "getCurrentDevice").andReturn(HVGA);
        expect(DeviceInfo.phoneModel).toEqual(HVGA.model);
    });

    it("phoneScreenHeightDefault returns the current pixel height of the device's primary screen", function () {
        spyOn(devices, "getCurrentDevice").andReturn(HVGA);
        expect(DeviceInfo.phoneScreenHeightDefault).toEqual(HVGA.screen.height);
    });

    it("phoneScreenWidthDefault returns the current pixel width of the device's primary screen", function () {
        spyOn(devices, "getCurrentDevice").andReturn(HVGA);
        expect(DeviceInfo.phoneScreenWidthDefault).toEqual(HVGA.screen.width);
    });

    it("phoneSoftware returns the current default software version", function () {
        spyOn(devices, "getCurrentDevice").andReturn(HVGA);
        expect(DeviceInfo.phoneSoftware).toEqual(HVGA.osVersion);
    });
});
