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
describe("geo", function () {
    var geo = require('ripple/geo'),
        db = require('ripple/db'),
        event = require('ripple/event');

    describe("getPositionInfo", function () {
        it("returns valid values", function () {
            var positionInfo = geo.getPositionInfo();

            expect(typeof positionInfo).toEqual("object");
            expect(typeof positionInfo.latitude).toEqual("number");
            expect(typeof positionInfo.longitude).toEqual("number");
            expect(typeof positionInfo.altitude).toEqual("number");
            expect(typeof positionInfo.accuracy).toEqual("number");
            expect(typeof positionInfo.altitudeAccuracy).toEqual("number");
            expect(typeof positionInfo.heading).toEqual("number");
            expect(typeof positionInfo.speed).toEqual("number");
            expect(typeof positionInfo.cellID).toEqual("number");
            expect(positionInfo.timeStamp instanceof Date).toEqual(true);
        });

        it("'s internal position info object is immutable", function () {
            var positionInfo = geo.getPositionInfo(),
                immutablePositionInfo;
            positionInfo.altitude = 1;
            immutablePositionInfo = geo.getPositionInfo();
            expect(positionInfo.altitude).not.toEqual(immutablePositionInfo.altitude);
        });
    });

    describe("updatePositionInfo", function () {
        it("throws exception when invalid input", function () {
            var positionInfo = {
                    latitude: "12",
                    longitude: false,
                    altitudeAccuracy: true,
                    cellID: 62,
                    timeStamp: "dfdgfdgfdgfdgf"
                };

            expect(function () {
                geo.updatePositionInfo(positionInfo);
            }).toThrow();
        });

        it("updates successfully", function () {
            var positionInfo = {
                latitude: 11,
                longitude: 21,
                altitude: 31,
                accuracy: 41,
                altitudeAccuracy: 51,
                heading: 0,
                speed: 0,
                cellID: 61,
                timeStamp: new Date()
            };

            spyOn(db, "saveObject");
            spyOn(event, "trigger");

            geo.updatePositionInfo(positionInfo, 4, true);

            expect(db.saveObject.callCount).toBe(1);
        });
    });
});
