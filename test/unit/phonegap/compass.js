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
describe("phonegap_compass", function () {
    var compass = require('ripple/platform/phonegap/1.0.0/compass'),
        geo = require('ripple/geo');

    it("clearWatch clears interval", function () {
        spyOn(global, "clearInterval");
        compass.clearWatch(30);
        expect(clearInterval).toHaveBeenCalledWith(30);
    });

    it("can get the current heading", function () {
        var failure = jasmine.createSpy("failure"),
            success = jasmine.createSpy("success");

        spyOn(geo, "getPositionInfo").andReturn({heading: 180});

        compass.getCurrentHeading(success, failure);

        waits(1);
        runs(function () {
            expect(failure).not.toHaveBeenCalled();
            expect(success).toHaveBeenCalledWith(180);
        });
    });

    it("can watch the heading", function () {
        var watchId,
            failure = jasmine.createSpy("failure"),
            success = jasmine.createSpy("success");

        // setInterval ok..., but setTimeout would be bad
        // node seemed to have diverged from what browser now and does not return id
        spyOn(global, "setInterval").andReturn(1);

        watchId = compass.watchHeading(success, failure);
        expect(watchId).toEqual(1);
        expect(setInterval).toHaveBeenCalled();
    });

    it("can watch the heading with custom frequency", function () {
        var options = {frequency: 10},
            failure = jasmine.createSpy("failure"),
            success = jasmine.createSpy("success");

        spyOn(global, "setInterval").andReturn(1);

        compass.watchHeading(success, failure, options);

        expect(setInterval.mostRecentCall.args[1]).toEqual(options.frequency);
    });

    it("returns a valid heading", function () {
        var watchId,
            options = {frequency: 10},
            info = {heading: 190},
            failure = jasmine.createSpy("failure"),
            success = jasmine.createSpy("success");

        spyOn(geo, "getPositionInfo").andReturn(info);
        spyOn(global, "setInterval").andCallFake(function (func) {
            func();
        });

        compass.watchHeading(success, failure, options);

        expect(failure).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalledWith(info.heading);
        compass.clearWatch(watchId);
    });
});
