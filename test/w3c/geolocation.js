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
    var sinon = require('sinon'),
        s,
        geo = require('ripple/geo'),
        event = require('ripple/event'),
        geolocation = require('ripple/platform/w3c/1.0/geolocation'),
        PositionError = require('ripple/platform/w3c/1.0/PositionError');

    beforeEach(function () {
        s = sinon.sandbox.create();
        //HACK: reset the state
        geo.delay = 0;
        geo.timeout = false;
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("getCurrentPosition calls the success callback", function () {
        geolocation.getCurrentPosition(
            s.mock().once(),
            s.mock().never());
        waits(1);
    });

    it("position info is updated on PositionInfoUpdatedEvent", function () {
        var stamp = new Date();

        event.trigger("PositionInfoUpdatedEvent", [{
            latitude: 1,
            longitude: 2,
            altitude: 3,
            altitudeAccuracy: 4,
            accuracy: 5,
            heading: 6,
            speed: 7,
            timeStamp: stamp
        }]);

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

    it("getCurrentPosition calls the error callback if geolocation is set to timeout", function () {
        geo.timeout = true;

        geolocation.getCurrentPosition(s.mock().never(), function (error) {
            expect(error).toBeDefined();
            expect(PositionError.TIMEOUT).toBe(error.code);
        });

    });

    it("watchPosition calls the error callback if options not provided", function () {
        geolocation.watchPosition(
            s.mock().never(),
            s.mock().once());
        waits(1);
    });

    it("watchPosition calls the error callback if options is missing frequency", function () {
        geolocation.watchPosition(
            s.mock().never(),
            s.mock().once(),
            {});
        waits(1);
    });

    it("watchPosition calls the error callback if frequency isn't a number", function () {
        geolocation.watchPosition(
            s.mock().never(),
            s.mock().once(),
            {frequency: "w00t"});
        waits(1);
    });

    it("watchPosition calls the callback on the given interval", function () {
        var watch = geolocation.watchPosition(
                    s.mock().thrice(),
                    s.mock().never(),
                    {frequency: 10});

        waits(39);
        runs(function () {
            geolocation.clearWatch(watch);
        });
    });
});
