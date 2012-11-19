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
describe("deviceMotionEmulator", function () {
    var event = ripple('event'),
        deviceMotionEmulator = ripple('deviceMotionEmulator');

    beforeEach(function () {
        spyOn(event, "on");
    });

    afterEach(function () {
    });

    describe("when initializing", function () {
        it("properly masks frame.addEventListener", function () {
            var addEventListener = jasmine.createSpy(),
                callback = jasmine.createSpy(),
                frame = {
                    contentWindow: {
                        addEventListener: addEventListener
                    }
                };

            deviceMotionEmulator.init(frame);
            frame.contentWindow.addEventListener('load', callback, false);

            expect(addEventListener).toHaveBeenCalledWith('load', callback, false);
        });

        it("properly masks frame.removeEventListener", function () {
            var removeEventListener = jasmine.createSpy(),
                callback = jasmine.createSpy(),
                frame = {
                    contentWindow: {
                        removeEventListener: removeEventListener
                    }
                };

            deviceMotionEmulator.init(frame);
            frame.contentWindow.removeEventListener('load', callback, false);

            expect(removeEventListener).toHaveBeenCalledWith('load', callback, false);
        });
    });
});
