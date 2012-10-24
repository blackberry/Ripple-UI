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
    var appServer = require('ripple/client/platform/webworks.tablet/2.0.0/server/app'),
        appClient = require('ripple/client/platform/webworks.tablet/2.0.0/client/app'),
        transport = require('ripple/client/platform/webworks.core/2.0.0/client/transport'),
        event = require('ripple/client/event'),
        app = require('ripple/client/app');

    describe("client", function () {
        var data = "data";

        beforeEach(function () {
            spyOn(transport, "call").andReturn(data);
        });

        describe("exit", function () {
            it("calls the transport appropriately", function () {
                appClient.exit();
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/exit", {async: true});
            });
        });

        describe("author", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.author).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/author");
            });
        });

        describe("authorEmail", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.authorEmail).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/authorEmail");
            });
        });

        describe("authorURL", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.authorURL).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/authorURL");
            });
        });

        describe("copyright", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.copyright).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/copyright");
            });
        });

        describe("description", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.description).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/description");
            });
        });

        describe("id", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.id).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/id");
            });
        });

        describe("license", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.license).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/license");
            });
        });

        describe("licenseURL", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.licenseURL).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/licenseURL");
            });
        });

        describe("name", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.name).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/name");
            });
        });

        describe("version", function () {
            it("calls the transport appropriately", function () {
                expect(appClient.version).toEqual("data");
                expect(transport.call).toHaveBeenCalledWith("blackberry/app/version");
            });
        });
    });

    describe("checks the config for", function () {
        function testConfigAccess(prop, expected) {
            var conf = {},
                result;

            conf[prop] = expected;
            spyOn(app, "getInfo").andReturn(conf);

            result = appServer[prop]().data;
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

    it("exit raises the app exit event", function () {
        spyOn(event, "trigger");
        appServer.exit();
        expect(event.trigger).toHaveBeenCalledWith("AppExit");
        expect(event.trigger.callCount).toBe(1);
    });
});
