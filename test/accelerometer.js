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
describe("accelerometer", function () {

    var accelerometer = require('ripple/accelerometer'),
        event = require('ripple/event'),
        sinon = require('sinon'),
        s,
        db = require('ripple/db'),
        MOCK_POSITIONINFO = {
            x: 4,
            y: 5,
            z: -9.8
        };

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("test getInfo should return a valid set of values", function () {
        var info = accelerometer.getInfo();

        expect(typeof info.accelerationIncludingGravity.x).toBe("number");
        expect("number", info.accelerationIncludingGravity.y, "expected y to be a number");
        expect("number", info.accelerationIncludingGravity.z, "expected z to be a number");
    });

    it("test getInfo should return a copied object", function () {
        var info = accelerometer.getInfo();
        info.x = 123456789;
        expect(accelerometer.getInfo().x).not.toBe(info.x);
    });

    it("test setInfo should throw an exception when given invalid input", function () {
        expect(function () {
            accelerometer.setInfo("fdfsfd", false, "43");
        }).toThrow();
    });

    it("setInfo should update successfully", function () {
        s.stub(db, "saveObject");
        accelerometer.setInfo({
            x: MOCK_POSITIONINFO.x,
            y: MOCK_POSITIONINFO.y,
            z: MOCK_POSITIONINFO.z
        });

        var info = accelerometer.getInfo();

        expect(MOCK_POSITIONINFO.x).toBe(info.accelerationIncludingGravity.x);
        expect(MOCK_POSITIONINFO.y).toBe(info.accelerationIncludingGravity.y);
        expect(MOCK_POSITIONINFO.z).toBe(info.accelerationIncludingGravity.z);
    });

    it("test should return a valid cached object when specified", function () {
        s.stub(db, "saveObject");
        accelerometer.setInfo(8, 8, 8);

        var info = accelerometer.getInfo(true);

        expect(info.x).not.toBe(8);
        expect(info.y).not.toBe(8);
        expect(info.z).not.toBe(8);
    });

    it("test shake should update cached x value", function () {
        s.stub(db, "saveObject");
        s.stub(event, "trigger");
        spyOn(global, "setInterval").andCallFake(function (callback) {
            callback();
        });

        var initialX = 50, accelValues;
        accelerometer.setInfo(initialX, 0, 0);
        accelerometer.shake();
        accelValues = accelerometer.getInfo(true);
        expect(initialX).not.toBe(accelValues.x);
    });

});
