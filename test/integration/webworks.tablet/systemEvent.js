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
describe("webworks.tablet system event", function () {
    var systemEvent = require('ripple/platform/webworks.tablet/2.0.0/client/systemEvent'),
        spec = require('ripple/platform/webworks.tablet/2.0.0/spec'),
        ww_XMLHttpRequest = require('ripple/platform/webworks.core/2.0.0/XMLHttpRequest'),
        helpers = require('ripple/xhr/helpers'),
        xhr = require('ripple/xhr'),
        platform = require('ripple/platform'),
        console = require('ripple/console'),
        event = require('ripple/event'),
        _oldXHR;

    function _run(delay, methods) {
        methods.forEach(function (method) {
            waits(delay);
            runs(method);
        });
    }

    // TODO: erroneous status codes and polling failures

    // mock everything outside of the (client -> XMLHttpRequest -> server) components being tested
    beforeEach(function () {
        _oldXHR = window.XMLHttpRequest;
        xhr.initialize();
        global.XMLHttpRequest = window.XMLHttpRequest = ww_XMLHttpRequest
            .create('ripple/platform/webworks.tablet/2.0.0/server');

        spyOn(platform, "current").andReturn(spec);
        spyOn(console, "log");
        spyOn(helpers, "proxyEnabled").andReturn(false);
    });

    describe("deviceBatteryStateChange", function () {
        it("de-registers onBatterStateChange", function () {
            var listener = jasmine.createSpy();
            systemEvent.deviceBatteryStateChange(listener);

            _run(20, [
                function () {
                    systemEvent.deviceBatteryStateChange(null);
                },
                function () {
                    event.trigger("DeviceBatteryStateChanged", [false]);
                },
                function () {
                    expect(listener).not.toHaveBeenCalled();
                    global.XMLHttpRequest = window.XMLHttpRequest = _oldXHR;
                }
            ]);
        });

        it("registers and invokes onBatteryStateChange", function () {
            var listener = jasmine.createSpy();
            systemEvent.deviceBatteryStateChange(listener);

            _run(20, [
                function () {
                    event.trigger("DeviceBatteryStateChanged", [false]);
                },
                function () {
                    expect(listener).toHaveBeenCalledWith(3); // UNPLUGGED
                    global.XMLHttpRequest = window.XMLHttpRequest = _oldXHR;
                }
            ]);
        });

    });

    describe("deviceBatteryLevelChange", function () {
        it("registers and invokes onBatterLevelChange", function () {
            var listener = jasmine.createSpy();
            systemEvent.deviceBatteryLevelChange(listener);

            _run(20, [
                function () {
                    event.trigger("DeviceBatteryLevelChanged", [80]);
                },
                function () {
                    expect(listener).toHaveBeenCalledWith(80);
                    // TODO: why does this cause tests to fail
                    //global.XMLHttpRequest = window.XMLHttpRequest = _oldXHR;
                }
            ]);
        });

        it("can deregister onBatterLevelChange", function () {
            var listener = jasmine.createSpy();
            systemEvent.deviceBatteryLevelChange(listener);

            _run(20, [
                function () {
                    systemEvent.deviceBatteryLevelChange(null);
                },
                function () {
                    event.trigger("DeviceBatteryLevelChanged", [70]);
                },
                function () {
                    expect(listener).not.toHaveBeenCalled();
                    global.XMLHttpRequest = window.XMLHttpRequest = _oldXHR;
                }
            ]);
        });
    });
});
