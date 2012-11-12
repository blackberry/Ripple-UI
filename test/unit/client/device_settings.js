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
describe("deviceSettings", function () {

    var deviceSettings = ripple('deviceSettings'),
        platform = ripple('platform'),
        db = ripple('db');

    beforeEach(function () {
        spyOn(platform, "current").andReturn({
            device: {
            }
        });
    });
    it("test retrieve returns undefined when not found", function () {
        expect(deviceSettings.retrieve("blah")).toBeFalsy();
    });

    it("test retrieve returns a falsy variable when found", function () {
        spyOn(db, "saveObject");
        deviceSettings.register("testSetting", false);
        deviceSettings.persist();
        expect(db.saveObject.mostRecentCall.args[1].testSetting).toEqual(false);
    });

    it("test creates and retrieves setting", function () {
        var testSetting = {
            "someSettings": ""
        };
        deviceSettings.register("testSetting", testSetting);
        expect(deviceSettings.retrieve("testSetting")).toEqual(testSetting);
    });

    it("test creates and persists setting", function () {
        spyOn(db, "saveObject");
        var testSetting = {
            "someSettings": ""
        };
        deviceSettings.register("testSetting", testSetting);
        deviceSettings.persist();
        expect(deviceSettings.retrieve("testSetting")).toEqual(testSetting);
    });

    it("test updates and persists setting", function () {
        spyOn(db, "saveObject");
        var testSetting = {
            "someSettings": ""
        };

        deviceSettings.register("testSetting", testSetting);
        deviceSettings.persist();

        testSetting.anotherTest = "test";

        deviceSettings.register("testSetting", testSetting);
        deviceSettings.persist();

        expect(db.saveObject.argsForCall[1][1].testSetting).toEqual(testSetting);
    });
});
