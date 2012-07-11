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
    var accel = require('ripple/platform/cordova/2.0.0/bridge/accelerometer'),
        event = require('ripple/event');

    beforeEach(function () {
        spyOn(window, "setInterval").andReturn(1);
        spyOn(window, "clearInterval");
    });

    afterEach(function () {
        accel.stop();
    });

    describe("when starting", function () {
        it("starts an interval", function () {
            var s = jasmine.createSpy("success"),
                f = jasmine.createSpy("fail");

            accel.start(s, f);
            expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 50);
        });

        it("the interval function calls the success callback with the AccelerometerInfoChangedEvent", function () {
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

            window.setInterval.mostRecentCall.args[0]();

            expect(s).toHaveBeenCalledWith({
                x: 9.8,
                y: 9.8,
                z: 9.8,
                timestamp: jasmine.any(Number)
            });

            expect(f).not.toHaveBeenCalled();
        });
    });

    describe("when stopping", function () {
        it("it clears the interval", function () {
            var s = jasmine.createSpy("success"),
                f = jasmine.createSpy("fail");

            accel.start(s, f);
            accel.stop();

            expect(window.clearInterval).toHaveBeenCalledWith(1);
        });
    });
});
