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
describe("phonegap_device", function () {
    var device = require('ripple/client/platform/cordova/1.0.0/device'),
        devices = require('ripple/client/devices');

    it("asks the device for the name", function () {
        spyOn(devices, "getCurrentDevice")
            .andReturn({name: "Samsung Awesomesauce"});

        expect(device.name).toEqual("Samsung Awesomesauce");
    });

    it("asks the device for the platform", function () {
        spyOn(devices, "getCurrentDevice")
            .andReturn({osName: "iOS"});

        expect(device.platform).toEqual("iOS");
    });

    it("asks the current device for the uuid", function () {
        spyOn(devices, "getCurrentDevice")
            .andReturn({uuid: "12345"});

        expect(device.uuid).toEqual("12345");
    });

    it("asks the current device for the version", function () {
        spyOn(devices, "getCurrentDevice")
            .andReturn({osVersion: "0.1"});

        expect(device.version).toEqual("0.1");
    });
});
