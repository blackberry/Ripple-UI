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
describe("phonegap_camera", function () {
    var camera = require('ripple/platform/cordova/1.0.0/camera');

    it("it calls the error callback ALL the time", function () {
        var success = jasmine.createSpy(),
            failure = jasmine.createSpy();

        camera.getPicture(success, failure);
        expect(failure).toHaveBeenCalledWith("not implemented");
    });

    it("it throws an error if no error callback", function () {
        expect(function () {
            camera.getPicture();
        }).toThrow();
    });
});
