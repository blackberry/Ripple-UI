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
describe("cordova accelerometer bridge", function () {
    var accel = require('ripple/platform/cordova/1.6/bridge/accelerometer'),
        event = require('ripple/event');

    afterEach(function () {
        accel.stop();
    });

    describe("when starting", function () {
        it("triggers the success callback on AccelerometerInfoChangedEvent", function () {
            var s = jasmine.createSpy("success"),
                f = jasmine.createSpy("fail");

            accel.start(s, f);

            event.trigger("AccelerometerInfoChangedEvent", [{
                accelerationIncludingGravity: {
                    x: 9.8,
                    y: 9.8,
                    z: 9.8
                }
            }], true);

            expect(s).toHaveBeenCalledWith({
                x: 1,
                y: 1,
                z: 1,
                timestamp: jasmine.any(Number)
            });

            expect(f).not.toHaveBeenCalled();
        });

        it("triggers the callback every time the event is fired", function () {
            var s = jasmine.createSpy("success"),
                f = jasmine.createSpy("fail");

            accel.start(s, f);

            event.trigger("AccelerometerInfoChangedEvent", [{
                accelerationIncludingGravity: { x: 9.8, y: 9.8, z: 9.8 } 
            }], true);

            event.trigger("AccelerometerInfoChangedEvent", [{
                accelerationIncludingGravity: { x: 9.8, y: 9.8, z: 9.8 } 
            }], true);

            expect(s.callCount).toBe(2);
        });

        it("doesn't call the callback if the AccelerometerInfoChangedEvent has not fired", function () {
            var s = jasmine.createSpy("success"),
                f = jasmine.createSpy("fail");

            accel.start(s, f);

            expect(s).not.toHaveBeenCalled();
            expect(f).not.toHaveBeenCalled();
        });
    });

    describe("when stopping", function () {
        it("doesn't call the callback after calling stop", function () {
            var s = jasmine.createSpy("success"),
                f = jasmine.createSpy("fail");

            accel.start(s, f);


            event.trigger("AccelerometerInfoChangedEvent", [{
                accelerationIncludingGravity: { x: 9.8, y: 9.8, z: 9.8 } 
            }], true);

            accel.stop(s, f);

            event.trigger("AccelerometerInfoChangedEvent", [{
                accelerationIncludingGravity: { x: 9.8, y: 9.8, z: 9.8 } 
            }], true);

            expect(s.callCount).toBe(1);
        });
    });
});
