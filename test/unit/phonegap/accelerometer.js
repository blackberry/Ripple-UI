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
describe("phonegap_accelerometer", function () {
    var accel = require('ripple/platform/phonegap/1.0.0/accelerometer'),
        event = require('ripple/event'),
        platform = require('ripple/platform');

    beforeEach(function () {
        spyOn(platform, "current").andReturn({name: "foo"});
    });

    it("getCurrentAcceleration calls the success callback", function () {
        var success = jasmine.createSpy();
        accel.getCurrentAcceleration(success, jasmine.createSpy());
        waits(1);
        runs(function () {
            expect(success.callCount).toEqual(1);
        });
    });

    // TODO: why does this fail when not run atomicly
    xit("acceleration info is updated on AccelerometerInfoChangedEvent", function () {
        event.trigger("AccelerometerInfoChangedEvent", [{
            x: 9.8,
            y: 9.8,
            z: 9.8
        }]);

        waits(1);

        runs(function () {
            accel.getCurrentAcceleration(function (acc) {
                expect(acc.x).toEqual(1);
                expect(acc.y).toEqual(1);
                expect(acc.z).toEqual(1);
            });
        });
    });

    it("watchAcceleration calls the error callback if options not provided", function () {
        var success = jasmine.createSpy("success"),
            failure = jasmine.createSpy("failure"),
            watchId = accel.watchAcceleration(success, failure);

        waits(1);

        runs(function () {
            clearInterval(watchId);
            expect(success).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalled();
        });
    });

    it("watchAcceleration calls the error callback if options is missing frequency", function () {
        var success = jasmine.createSpy("success"),
            failure = jasmine.createSpy("failure"),
            options = {},
            watchId = accel.watchAcceleration(success, failure, options);

        waits(1);

        runs(function () {
            clearInterval(watchId);
            expect(success).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalled();
        });
    });

    it("watchAcceleration calls the error callback if frequency isn't a number", function () {
        var success = jasmine.createSpy("success"),
            failure = jasmine.createSpy("failure"),
            options = {frequency: "w00t"},
            watchId = accel.watchAcceleration(success, failure, options);

        waits(1);

        runs(function () {
            // TODO: test clearWatch (techdebt)
            clearInterval(watchId);
            expect(success).not.toHaveBeenCalled();
            expect(failure).toHaveBeenCalled();
        });
    });

    it("watchAcceleration calls the callback on the given interval", function () {
        var success = jasmine.createSpy("success"),
            failure = jasmine.createSpy("failure"),
            options = {frequency: 10},
            watchId = accel.watchAcceleration(success, failure, options);

        waits(39);

        runs(function () {
            clearInterval(watchId);
            expect(success.callCount).toEqual(3);
            expect(failure).not.toHaveBeenCalled();
        });
    });
});
