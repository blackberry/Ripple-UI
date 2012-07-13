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
describe("platform", function () {
    var platform = require('ripple/platform'),
        db = require('ripple/db'),
        app = require('ripple/app'),
        builder = require('ripple/platform/builder'),
        utils = require('ripple/utils'),
        event = require('ripple/event'),
        _console = require('ripple/console');

    beforeEach(function () {
        spyOn(db, "retrieveObject");
        spyOn(db, "saveObject").andCallFake(function (a, b, c, baton) {
            return baton && baton();
        });

        spyOn(db, "save").andCallFake(function (a, b, c, baton) {
            return baton && baton();
        });

        spyOn(_console, "log");
        spyOn(utils, "queryString").andReturn({});
        spyOn(builder, "build").andReturn({
            into: function () {}
        });
        platform.initialize();
    });

    it("getList should return correct value", function () {
        var returnedPlatforms = platform.getList();

        expect(typeof returnedPlatforms["phonegap"]["1.0.0"].id).toEqual("string");
        expect(typeof returnedPlatforms["phonegap"]["1.0.0"].name).toEqual("string");
        expect(typeof returnedPlatforms["phonegap"]["1.0.0"].type).toEqual("string");
    });

    describe("when changing the environment", function () {
        var platformSpec = {
                name: "someplatform",
                version: "1.0"
            },
            deviceId = "some_id";

        beforeEach(function () {
            spyOn(event, "trigger");
        });

        it("saves the platform", function () {
            platform.changeEnvironment(platformSpec, deviceId, function () {
                expect(db.saveObject).toHaveBeenCalledWith("api-key", platformSpec, null, jasmine.any(Function));
            });
        });

        it("saves the device", function () {
            platform.changeEnvironment(platformSpec, deviceId, function () {
                expect(db.save).toHaveBeenCalledWith("device-key", "some_id", null, jasmine.any(Function));
            });
        });

        it("removes the persisted value for the layout", function () {
            platform.changeEnvironment(platformSpec, deviceId, function () {
                expect(db.save).toHaveBeenCalledWith("layout", null, null, jasmine.any(Function));
            });
        });

        it("triggers the platform changed event", function () {
            platform.changeEnvironment(platformSpec, deviceId, function () {
                expect(event.trigger).toHaveBeenCalledWith("PlatformChangedEvent", [], true);
            });
        });
    });

    it("returns the current platform", function () {
        expect(platform.current()).toBeDefined();
    });

    describe("when getting the persistence prefix", function () {
        it("appends the provided id to the value from the platform", function () {
            expect(platform.getPersistencePrefix("foo")).toBe(platform.current().persistencePrefix + "foo-");
        });

        it("gets the id from the app info if no id provided", function () {
            spyOn(app, "getInfo").andReturn({ id: "w00t" });
            expect(platform.getPersistencePrefix()).toBe(platform.current().persistencePrefix + "w00t-");
        });
    });
});
