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
describe("Cordova Device Bridge", function () {
    describe("on getDeviceInfo", function () {
        var _devices = ripple('platform/cordova/2.0.0/bridge/device'),
        devices = ripple('devices'),
        s,
        e,
        _deviceInfo = {
            available: true,
            osName: "Unit Test OS",
            osVersion: "0.1.0",
            name: "Unit Test Device",
            uuid: Math.uuid(),
            cordova: "2.0.0" //hard-coded in lib/client/platform/cordova/2.0.0/bridge/device.js
        };

        beforeEach(function () {
            s = jasmine.createSpy("success");
            e = jasmine.createSpy("error");

            spyOn(devices, "getCurrentDevice").andReturn(_deviceInfo);
        });

        it("can be called with only success specified", function () {
            _devices.getDeviceInfo(s);
            expect(s).toHaveBeenCalled();
            expect(s.mostRecentCall.args[0].available).toEqual(_deviceInfo.available);
            expect(s.mostRecentCall.args[0].platform).toEqual(_deviceInfo.osName);
            expect(s.mostRecentCall.args[0].version).toEqual(_deviceInfo.osVersion);
            expect(s.mostRecentCall.args[0].name).toEqual(_deviceInfo.name);
            expect(s.mostRecentCall.args[0].uuid).toEqual(_deviceInfo.uuid);
            expect(s.mostRecentCall.args[0].cordova).toEqual(_deviceInfo.cordova);
        });

        it("can be called with success and fail specified", function () {
            _devices.getDeviceInfo(s, e);
            expect(s).toHaveBeenCalled();
            expect(s.mostRecentCall.args[0].available).toEqual(_deviceInfo.available);
            expect(s.mostRecentCall.args[0].platform).toEqual(_deviceInfo.osName);
            expect(s.mostRecentCall.args[0].version).toEqual(_deviceInfo.osVersion);
            expect(s.mostRecentCall.args[0].name).toEqual(_deviceInfo.name);
            expect(s.mostRecentCall.args[0].uuid).toEqual(_deviceInfo.uuid);
            expect(s.mostRecentCall.args[0].cordova).toEqual(_deviceInfo.cordova);
            expect(e).not.toHaveBeenCalled();
        });

        it("can be called with success, fail and empty args specified", function () {
            _devices.getDeviceInfo(s, e, []);
            expect(s).toHaveBeenCalled();
            expect(s.mostRecentCall.args[0].available).toEqual(_deviceInfo.available);
            expect(s.mostRecentCall.args[0].platform).toEqual(_deviceInfo.osName);
            expect(s.mostRecentCall.args[0].version).toEqual(_deviceInfo.osVersion);
            expect(s.mostRecentCall.args[0].name).toEqual(_deviceInfo.name);
            expect(s.mostRecentCall.args[0].uuid).toEqual(_deviceInfo.uuid);
            expect(s.mostRecentCall.args[0].cordova).toEqual(_deviceInfo.cordova);
            expect(e).not.toHaveBeenCalled();
        });
    });
});
