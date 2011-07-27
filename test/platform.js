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
        builder = require('ripple/platform/builder'),
        event = require('ripple/event'),
        _console = require('ripple/console'),
        resizer = require('ripple/resizer'),
        constants = require('ripple/constants'),
        HVGA = require('ripple/devices/HVGA'),
        _platformChangeEventTriggered;

    beforeEach(function () {
        spyOn(db, "retrieveObject");
        spyOn(_console, "log");
        spyOn(builder, "build").andReturn({
            into: function () {}
        });
        platform.initialize();
    });

    it("getPlatformNameValues should return correct value", function () {
        var returnedPlatforms = platform.getList();

        expect(typeof returnedPlatforms["wac"]["1.0"].id).toEqual("string");
        expect(typeof returnedPlatforms["wac"]["1.0"].name).toEqual("string");
        expect(typeof returnedPlatforms["wac"]["1.0"].type).toEqual("string");
    });

    it("changeEnvironment should persist successfully", function () {
        spyOn(platform, "initialize");
        spyOn(db, "saveObject").andCallFake(function (a, b, c, baton) {
            baton();
        });
        spyOn(db, "save").andCallFake(function (a, b, c, baton) {
            return baton && baton();
        });
        spyOn(event, "trigger");
        spyOn(resizer, "resize");

        var platformSpec = {
                name: "someplatform",
                version: "1.0"
            },
            deviceId = "some_id";

        platform.changeEnvironment(platformSpec, deviceId);

        expect(db.saveObject.argsForCall[0][0]).toEqual("api-key");
        expect(db.save.argsForCall[0][0]).toEqual("device-key");

        //Expected layout to be set to null in persistence
        expect(db.save.argsForCall[1][0]).toEqual(constants.ENCAPSULATOR.LAYOUT);
        expect(db.save.argsForCall[1][1]).toEqual(null);

        expect(event.trigger.argsForCall[0][0]).toEqual("PlatformChangedEvent");
    });

    it("getID should return a string", function () {
        expect(typeof platform.current().id).toEqual("string");
    });

    it("getVersion should return a string", function () {
        expect(typeof platform.current().version).toEqual("string");
    });

    it("getDeviceSettings should return an object", function () {
        expect(typeof platform.current().device).toEqual("object");
    });

});
