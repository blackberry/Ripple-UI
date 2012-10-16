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
var devices = require('ripple/client/devices'),
    constants = require('ripple/client/constants'),
    nav = require('ripple/client/platform/w3c/1.0/navigator');

describe("w3c navigator", function () {
    it("returns the useragent from the current device", function () {
        spyOn(devices, "getCurrentDevice").andReturn({
            userAgent: "teh awesome"
        });

        expect(nav.userAgent).toBe("teh awesome");
    });

    it("returns window.navigator.userAgent when current device uses the default", function () {
        spyOn(devices, "getCurrentDevice").andReturn({
            userAgent: constants.COMMON.USER_AGENT_DEFAULT
        });

        expect(nav.userAgent).toBe(window.navigator.userAgent);
    });

    // TODO: tighten
    it("mixes in window.navigator", function () {
        //this property should have been mixed in
        expect(typeof nav.geolocation).toBe("object");
        expect(nav.geolocation).toBe(window.navigator.geolocation);

        expect(typeof nav.javaEnabled).toBe("function");
    });
});
