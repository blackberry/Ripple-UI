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
describe("w3c_geolocation", function () {
    var geo = require('ripple/geo'),
        geolocation = require('ripple/platform/w3c/1.0/geolocation'),
        PositionError = require('ripple/platform/w3c/1.0/PositionError'),
        success,
        error;

    beforeEach(function () {
        geo.delay = 0;
        geo.timeout = false;
        success = jasmine.createSpy("success_callback");
        error = jasmine.createSpy("error_callback");

        spyOn(window, "setTimeout").andCallFake(function (func) {
            func();
        });
    });

    describe("getCurrentPosition", function () {
        it("calls the success callback", function () {
            geolocation.getCurrentPosition(success, error);
            expect(success).toHaveBeenCalled();
        });

        it("uses the value from geo.getPositionInfo", function () {
            var stamp = new Date();

            spyOn(geo, "getPositionInfo").andReturn({
                latitude: 1,
                longitude: 2,
                altitude: 3,
                altitudeAccuracy: 4,
                accuracy: 5,
                heading: 6,
                speed: 7,
                timeStamp: stamp
            });

            geolocation.getCurrentPosition(function (pos) {
                expect(1).toBe(pos.coords.latitude);
                expect(2).toBe(pos.coords.longitude);
                expect(3).toBe(pos.coords.altitude);
                expect(4).toBe(pos.coords.altitudeAccuracy);
                expect(5).toBe(pos.coords.accuracy);
                expect(6).toBe(pos.coords.heading);
                expect(7).toBe(pos.coords.speed);
                expect(stamp.getTime()).toBe(pos.timestamp);
            });
        });

        it("calls the error callback if geolocation is set to timeout", function () {
            geo.timeout = true;

            geolocation.getCurrentPosition(success, function (error) {
                expect(error).toBeDefined();
                expect(PositionError.TIMEOUT).toBe(error.code);
            });

            expect(success).not.toHaveBeenCalled();
        });
    });

    describe("watchPosition", function () {
        describe("calls the error callback when", function () {
            it("doesn't provide any options", function () {
                geolocation.watchPosition(success, error);
                expect(error).toHaveBeenCalled();
            });

            it("provides options with a missing frequency", function () {
                geolocation.watchPosition(success, error, {});
                expect(error).toHaveBeenCalled();
            });

            it("has a frequency that isn't a number", function () {
                geolocation.watchPosition(success, error, {frequency: "w00t"});
                expect(error).toHaveBeenCalled();
            });
        });

        it("calls the success callback on the given interval", function () {
            var watch = geolocation.watchPosition(success, error, {frequency: 10});
            waits(39);
            runs(function () {
                expect(success.callCount).toBe(3);
                geolocation.clearWatch(watch);
            });
        });
    });
});
