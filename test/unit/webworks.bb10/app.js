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
describe("webworks_app", function () {
    var target = require('ripple/platform/webworks.bb10/1.0.0/app'),
        event = require('ripple/event'),
        bb10event = require('ripple/platform/webworks.bb10/1.0.0/event'),
        app = require('ripple/app');

    describe("blackberry.app events", function () {
        var listener,
            infoWithAppFeatureEnabled = {
                // features could be blank, but this ensures all feature strings are set correctly
                features: {"blackberry.app": {feature: {}}}
            };

        beforeEach(function () {
            listener = jasmine.createSpy("listener");
            spyOn(app, 'getInfo').andReturn(infoWithAppFeatureEnabled);
        });

        describe("keyboardClosing", function () {
            it("is triggered on KeyboardClosing", function () {
                bb10event.addEventListener("keyboardClosing", listener);
                event.trigger("KeyboardClosing", null, true);
                expect(listener).toHaveBeenCalled();
                bb10event.removeEventListener("keyboardClosing", listener);
            });
        });

        describe("keyboardClosed", function () {
            it("is triggered on KeyboardClosed", function () {
                bb10event.addEventListener("keyboardClosed", listener);
                event.trigger("KeyboardClosed", null, true);
                expect(listener).toHaveBeenCalled();
                bb10event.removeEventListener("keyboardClosed", listener);
            });
        });

        describe("keyboardOpening", function () {
            it("is triggered on KeyboardOpening", function () {
                bb10event.addEventListener("keyboardOpening", listener);
                event.trigger("KeyboardOpening", null, true);
                expect(listener).toHaveBeenCalled();
                bb10event.removeEventListener("keyboardOpening", listener);
            });
        });

        describe("keyboardOpened", function () {
            it("is triggered on KeyboardOpened", function () {
                bb10event.addEventListener("keyboardOpened", listener);
                event.trigger("KeyboardOpened", null, true);
                expect(listener).toHaveBeenCalled();
                bb10event.removeEventListener("keyboardOpened", listener);
            });
        });

        describe("keyboardPosition", function () {
            it("is triggered on KeyboardPosition", function () {
                var yPos = 4;
                bb10event.addEventListener("keyboardPosition", listener);
                event.trigger("KeyboardPosition", [yPos], true);
                expect(listener).toHaveBeenCalledWith(yPos);
                bb10event.removeEventListener("keyboardPosition", listener);
            });
        });
    });

    describe("checks the config for", function () {
        function testConfigAccess(prop, expected) {
            var conf = {},
                result;

            conf[prop] = expected;
            spyOn(app, "getInfo").andReturn(conf);

            result = target[prop];
            expect(app.getInfo).toHaveBeenCalled();
            expect(result).toBe(expected);
        }

        it("the author name", function () {
            testConfigAccess("author", "Ernest Hemingway");
        });

        it("the author email", function () {
            testConfigAccess("authorEmail", "gtanner@gmail.com");
        });

        it("the author email", function () {
            testConfigAccess("authorEmail", "gtanner@gmail.com");
        });

        it("the author url", function () {
            testConfigAccess("authorURL", "http://tinyhippos.com");
        });

        it("the copyright", function () {
            testConfigAccess("copyright", "mine!");
        });

        it("the description", function () {
            testConfigAccess("description", "I am on a boat");
        });

        it("the id", function () {
            testConfigAccess("id", "42");
        });

        it("the license", function () {
            testConfigAccess("license", "WTFPL");
        });

        it("the licenseURL", function () {
            testConfigAccess("licenseURL", "http://sam.zoy.org/wtfpl/COPYING");
        });

        it("the name", function () {
            testConfigAccess("name", "Who");
        });

        it("the version", function () {
            testConfigAccess("version", "almost done");
        });
    });
});
