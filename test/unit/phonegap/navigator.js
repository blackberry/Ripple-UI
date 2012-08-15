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
describe("phonegap_navigator", function () {
    var event = require('ripple/event'),
        devices = require('ripple/devices'),
        emulatorBridge = require('ripple/emulatorBridge'),
        navigator,
        _console = require('ripple/console');

    beforeEach(function () {
        spyOn(devices, "getCurrentDevice").andReturn("WTF");
        navigator = require('ripple/platform/cordova/1.0.0/navigator');
    });

    it("it fires device ready and logs when tinyHippos Loaded event is raised", function () {
        spyOn(emulatorBridge, "document").andReturn(document);
        spyOn(document, "dispatchEvent");
        spyOn(_console, "log");

        event.trigger("TinyHipposLoaded");

        waits(1);
        runs(function () {
            expect(document.dispatchEvent.callCount).toEqual(1);
            expect(_console.log.callCount).toEqual(1);
        });
    });
});
