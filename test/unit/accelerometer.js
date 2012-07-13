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
describe("accelerometer", function () {
    var accelerometer,
        Rotation,
        Acceleration,
        event,
        db = require('ripple/db'),
        deviceMotionEventSpy,
        deviceOrientationEventSpy,
        accelerometerInfoChangedEventSpy,
        MOCK_POSITIONINFO = {
            x: 4,
            y: 5,
            z: -9.8,
            alpha: 30,
            beta: 45,
            gamma: 90
        },
        _pos = {
            x: MOCK_POSITIONINFO.x,
            y: MOCK_POSITIONINFO.y,
            z: MOCK_POSITIONINFO.z,
            alpha: MOCK_POSITIONINFO.alpha,
            beta: MOCK_POSITIONINFO.beta,
            gamma: MOCK_POSITIONINFO.gamma
        };

    beforeEach(function () {
        accelerometer = require('ripple/accelerometer');
        Rotation = require('ripple/platform/w3c/1.0/Rotation');
        Acceleration = require('ripple/platform/w3c/1.0/Acceleration');
        event = require('ripple/event');
        db = require('ripple/db');
        spyOn(db, "saveObject");
    });

    describe("on getInfo", function () {
        it("test getInfo should return a valid set of values", function () {
            var info = accelerometer.getInfo();

            expect(typeof info.accelerationIncludingGravity.x).toBe("number");
            expect("number", info.accelerationIncludingGravity.y, "expected y to be a number");
            expect("number", info.accelerationIncludingGravity.z, "expected z to be a number");
        });

        it("test getInfo should return a copied object", function () {
            var info = accelerometer.getInfo();
            info.x = 123456789;
            expect(accelerometer.getInfo().x).not.toBe(info.x);
        });

        it("test should return a valid cached object when specified", function () {
            var info = accelerometer.getInfo(true);

            expect(info.x).not.toBe(8);
            expect(info.y).not.toBe(8);
            expect(info.z).not.toBe(8);
        });
    });

    describe("on setInfo", function () {
        it("setInfo should update successfully", function () {
            accelerometer.setInfo({
                x: MOCK_POSITIONINFO.x,
                y: MOCK_POSITIONINFO.y,
                z: MOCK_POSITIONINFO.z
            });

            var info = accelerometer.getInfo();

            expect(MOCK_POSITIONINFO.x).toBe(info.accelerationIncludingGravity.x);
            expect(MOCK_POSITIONINFO.y).toBe(info.accelerationIncludingGravity.y);
            expect(MOCK_POSITIONINFO.z).toBe(info.accelerationIncludingGravity.z);
        });

        describe("events firing", function () {
            beforeEach(function () {
                deviceMotionEventSpy = jasmine.createSpy("DeviceMotionEvent");
                deviceOrientationEventSpy = jasmine.createSpy("DeviceOrientationEvent");
                accelerometerInfoChangedEventSpy = jasmine.createSpy("AccelerometerInfoChangedEvent");

                event.on("DeviceMotionEvent", deviceMotionEventSpy);
                event.on("DeviceOrientationEvent", deviceOrientationEventSpy);
                event.on("AccelerometerInfoChangedEvent", accelerometerInfoChangedEventSpy);
            });

            it("should fire DeviceMotionEvent when setInfo is called", function () {
                accelerometer.setInfo(_pos);

                waits(1);
                runs(function () {
                    expect(deviceMotionEventSpy).toHaveBeenCalled();
                    var _a = deviceMotionEventSpy.mostRecentCall.args[0];
                    expect(_a.acceleration).toEqual(new Acceleration(MOCK_POSITIONINFO.x, MOCK_POSITIONINFO.y, MOCK_POSITIONINFO.z));
                    expect(_a.accelerationIncludingGravity).toEqual(new Acceleration(MOCK_POSITIONINFO.x, MOCK_POSITIONINFO.y, MOCK_POSITIONINFO.z));
                    expect(_a.rotationRate).toEqual(new Rotation(0, 0, 0));
                    expect(_a.orientation).toEqual(new Rotation(MOCK_POSITIONINFO.alpha, MOCK_POSITIONINFO.beta, MOCK_POSITIONINFO.gamma));
                    expect(_a.timestamp).toBeCloseTo(new Date().getTime(), 5000);
                });
            });

            it("should fire DeviceOrientationEvent when setInfo is called", function () {
                accelerometer.setInfo(_pos);

                waits(1);
                runs(function () {
                    expect(deviceOrientationEventSpy).toHaveBeenCalled();
                    var _a = deviceOrientationEventSpy.mostRecentCall.args[0];
                    expect(_a.acceleration).toEqual(new Acceleration(MOCK_POSITIONINFO.x, MOCK_POSITIONINFO.y, MOCK_POSITIONINFO.z));
                    expect(_a.accelerationIncludingGravity).toEqual(new Acceleration(MOCK_POSITIONINFO.x, MOCK_POSITIONINFO.y, MOCK_POSITIONINFO.z));
                    expect(_a.rotationRate).toEqual(new Rotation(0, 0, 0));
                    expect(_a.orientation).toEqual(new Rotation(MOCK_POSITIONINFO.alpha, MOCK_POSITIONINFO.beta, MOCK_POSITIONINFO.gamma));
                    expect(_a.timestamp).toBeCloseTo(new Date().getTime(), 5000);
                });
            });

            it("should fire AccelerometerInfoChangedEvent when setInfo is called", function () {
                accelerometer.setInfo(_pos);

                waits(1);
                runs(function () {
                    expect(accelerometerInfoChangedEventSpy).toHaveBeenCalled();
                    var _a = accelerometerInfoChangedEventSpy.mostRecentCall.args[0];
                    expect(_a.acceleration).toEqual(new Acceleration(MOCK_POSITIONINFO.x, MOCK_POSITIONINFO.y, MOCK_POSITIONINFO.z));
                    expect(_a.accelerationIncludingGravity).toEqual(new Acceleration(MOCK_POSITIONINFO.x, MOCK_POSITIONINFO.y, MOCK_POSITIONINFO.z));
                    expect(_a.rotationRate).toEqual(new Rotation(0, 0, 0));
                    expect(_a.orientation).toEqual(new Rotation(MOCK_POSITIONINFO.alpha, MOCK_POSITIONINFO.beta, MOCK_POSITIONINFO.gamma));
                    expect(_a.timestamp).toBeCloseTo(new Date().getTime(), 5000);
                });
            });
        });
    });

    describe("on shake", function () {
        it("test shake should update cached x value", function () {
            spyOn(global, "setInterval").andCallFake(function (callback) {
                callback();
            });

            var initialX = 50, accelValues;
            accelerometer.setInfo(initialX, 0, 0);
            accelerometer.shake();
            accelValues = accelerometer.getInfo(true);
            expect(initialX).not.toBe(accelValues.x);
        });
    });
});
