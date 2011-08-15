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
describe("wac_PositionInfo", function () {

    var PositionInfo = require('ripple/platform/wac/1.0/PositionInfo'),
        db = require('ripple/db'),
        event = require('ripple/event'),
        geo = require('ripple/geo'),
        stub = {
            "latitude": 43.465187,
            "longitude": -80.522372,
            "altitude": 100,
            "accuracy": 150,
            "altitudeAccuracy": 80,
            "cellID": 321654,
            "timeStamp": new Date()
        },
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
        s.stub(db, "retrieveObject").returns(stub);
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("gets its default values from the db", function () {
        spyOn(geo, "getPositionInfo").andReturn(stub);
        expect(PositionInfo.latitude).toEqual(stub.latitude);
        expect(PositionInfo.longitude).toEqual(stub.longitude);
        expect(PositionInfo.altitude).toEqual(stub.altitude);
        expect(PositionInfo.accuracy).toEqual(stub.accuracy);
        expect(PositionInfo.altitudeAccuracy).toEqual(stub.altitudeAccuracy);
        expect(PositionInfo.cellID).toEqual(stub.cellID);
    });
});
