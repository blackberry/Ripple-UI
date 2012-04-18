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
    var target = require('ripple/platform/webworks.bb10/1.0.0/client/app'),
        event = require('ripple/event'),
        app = require('ripple/app');

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
