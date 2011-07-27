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
describe("wac_DataNetworkInfo", function () {
    var DataNetworkInfo = require('ripple/platform/wac/1.0/DataNetworkInfo'),
        ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
        deviceSettings = require('ripple/deviceSettings'),
        platform = require('ripple/platform'),
        _console = require('ripple/console'),
        event = require('ripple/event');

    beforeEach(function () {
        spyOn(platform, "current").andReturn({
            name: "default",
            device: {
                "DataNetworkInfo": {
                    "isDataNetworkConnected": {control: {value: false}},
                    "networkConnectionType": {control: {value: ["dude"]}}
                }
            }
        });
    });

    describe("isDataNetworkConnected", function () {
        it("isDataNetworkConnected should return a default control value", function () {
            expect(DataNetworkInfo.isDataNetworkConnected).toEqual(false);
        });

        it("isDataNetworkConnected should return a registered boolean value", function () {
            deviceSettings.register("DataNetworkInfo.isDataNetworkConnected", true);
            expect(DataNetworkInfo.isDataNetworkConnected).toEqual(true);
        });
    });

    describe("networkConnectionType", function () {
        it("should return a valid array of values", function () {
            expect(DataNetworkInfo.networkConnectionType).toEqual(["dude"]);
        });

        it("should invoke onNetworkConnectionChanged when changed", function () {
            var connectionType = ["EDGE"];
            spyOn(_console, "log");
            DataNetworkInfo.onNetworkConnectionChanged = jasmine.createSpy();
            event.trigger("DataNetworkConnectionChanged", connectionType, true);
            expect(DataNetworkInfo.onNetworkConnectionChanged).toHaveBeenCalled();
        });
    });

    describe("getNetworkConnectionName", function () {
        it("throws INVALID_PARAMETER exception when invalid argument types", function () {
            spyOn(_console, "log");
            expect(function () {
                DataNetworkInfo.getNetworkConnectionName(60);
            }).toThrow(function (e) {
                return e.type === ExceptionTypes.INVALID_PARAMETER;
            });
        });

        it("returns a default control", function () {
            expect(DataNetworkInfo.getNetworkConnectionName("wifi")).toEqual("WIFI");
        });

        it("returns a null when non valid connection name", function () {
            expect(DataNetworkInfo.getNetworkConnectionName("foo")).toEqual(null);
        });
    });
});
