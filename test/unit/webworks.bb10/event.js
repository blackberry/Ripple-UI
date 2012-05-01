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
describe("event", function () {
    var target = require('ripple/platform/webworks.bb10/1.0.0/client/event'),
        event = require('ripple/event');

    describe("general event stuff", function () {
        describe("when adding", function () {
            it("triggers the callback", function () {
                var cb = jasmine.createSpy();

                target.addEventListener("pause", cb);
                event.trigger("appPause", null, true);
                expect(cb).toHaveBeenCalled();
            });

            it("can trigger multiple callbacks", function () {
                var cb = jasmine.createSpy(),
                    cb2 = jasmine.createSpy();

                target.addEventListener("pause", cb);
                target.addEventListener("pause", cb2);
                event.trigger("appPause", null, true);
                expect(cb).toHaveBeenCalled();
                expect(cb2).toHaveBeenCalled();
            });

            it("will only call a function instance once", function () {
                var cb = jasmine.createSpy();

                target.addEventListener("pause", cb);
                target.addEventListener("pause", cb);
                event.trigger("appPause", null, true);
                expect(cb.callCount).toBe(1);
            });

            it("doesn't call the callback if the event isn't raised", function () {
                var cb = jasmine.createSpy();

                target.addEventListener("pause", cb);
                expect(cb).not.toHaveBeenCalled();
            });
        });

        describe("when removing", function () {
            it("doesn't call the function after it has been removed", function () {
                var cb = jasmine.createSpy();

                target.addEventListener("pause", cb);
                target.removeEventListener("pause", cb);
                event.trigger("appPause", null, true);
                expect(cb).not.toHaveBeenCalled();
            });
        });

        describe("specific event handlers", function () {
            var settings = require('ripple/deviceSettings');

            beforeEach(function () {
                spyOn(settings, "retrieve").andReturn("22");
            });

            it("triggers the pause event on appPause", function () {
                var cb = jasmine.createSpy();

                target.addEventListener("pause", cb);
                event.trigger("appPause", null, true);
                expect(cb).toHaveBeenCalled();
            });

            it("triggers the resume event on appResume", function () {
                var cb = jasmine.createSpy();

                target.addEventListener("resume", cb);
                event.trigger("appResume", null, true);
                expect(cb).toHaveBeenCalled();
            });

            it("triggers the batterystatus event on DeviceBatteryStateChanged", function () {
                var cb = jasmine.createSpy();

                target.addEventListener("batterystatus", cb);
                event.trigger("DeviceBatteryStateChanged", [true], true);
                expect(cb).toHaveBeenCalledWith({
                    isPlugged: true,
                    level: 22
                });
            });

            describe("on the DeviceBatteryLevelChanged event", function () {
                it("triggers batterystatus", function () {
                    var cb = jasmine.createSpy();

                    target.addEventListener("batterystatus", cb);
                    event.trigger("DeviceBatteryLevelChanged", ["99"], true);
                    expect(cb).toHaveBeenCalledWith({
                        isPlugged: '22',
                        level: 99
                    });
                });

                it("doesnt trigger battery low when level is not 14", function () {
                    var cb = jasmine.createSpy();

                    target.addEventListener("batterylow", cb);
                    event.trigger("DeviceBatteryLevelChanged", ["16"], true);
                    expect(cb).not.toHaveBeenCalled();
                });

                it("triggers battery low when level is 14", function () {
                    var cb = jasmine.createSpy();

                    target.addEventListener("batterylow", cb);
                    event.trigger("DeviceBatteryLevelChanged", ["14"], true);
                    expect(cb).toHaveBeenCalledWith({
                        isPlugged: '22',
                        level: 14
                    });
                });

                it("doesn't trigger batterycritical when level is not 4", function () {
                    var cb = jasmine.createSpy();

                    target.addEventListener("batterycritical", cb);
                    event.trigger("DeviceBatteryLevelChanged", [6], true);
                    expect(cb).not.toHaveBeenCalled();
                });

                it("triggers batterycritical when level is 4", function () {
                    var cb = jasmine.createSpy();

                    target.addEventListener("batterycritical", cb);
                    event.trigger("DeviceBatteryLevelChanged", ["4"], true);
                    expect(cb).toHaveBeenCalledWith({
                        isPlugged: '22',
                        level: 4
                    });
                });
            });
        });
    });
});
