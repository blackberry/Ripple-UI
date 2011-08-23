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
describe("wac_RadioInfo", function () {

    var RadioInfo = require('ripple/platform/wac/1.0/RadioInfo'),
        RadioSignalSourceTypes = require('ripple/platform/wac/1.0/RadioSignalSourceTypes'),
        utils = require('ripple/utils'),
        event = require('ripple/event'),
        _console = require('ripple/console'),
        platform = require('ripple/platform');

    function _isValidSignalSource(sourceToCheck) {
        var validValues = RadioSignalSourceTypes,
            flag = false;

        utils.forEach(validValues, function (sourceKey, sourceValue) {
            if (sourceToCheck === sourceValue) {
                flag = true;
                return true;
            }
        });

        return flag;
    }

    beforeEach(function () {
        spyOn(platform, "current").andReturn({
            name: "whatup",
            device: {
                "RadioInfo": {
                    "isRoaming": {control: {value: true}},
                    "isRadioEnabled": {control: {value: false}},
                    "radioSignalStrengthPercent": {control: {value: 60}},
                    "radioSignalSource": {control: {value: "LTE"}}
                }
            }
        });
    });

    // --------- Tests -------- \\

    it("isRoaming returns default control", function () {
        expect(RadioInfo.isRoaming).toEqual(true);
    });

    it("isRadioEnabled returns a default control", function () {
        expect(RadioInfo.isRadioEnabled).toEqual(false);
    });

    it("radioSignalStrengthPercent returns a default value", function () {
        expect(RadioInfo.radioSignalStrengthPercent).toEqual(60);
    });

    it("radioSignalSource is returns a default value", function () {
        expect(_isValidSignalSource(RadioInfo.radioSignalSource)).toEqual(true);
    });

    it("radioSignalSource change invokes onSignalSourceChange when changed", function () {
        spyOn(_console, "log");
        RadioInfo.onSignalSourceChange = jasmine.createSpy();
        event.trigger("RadioSignalSourceChanged", [], true);

        expect(RadioInfo.onSignalSourceChange).toHaveBeenCalledWith("LTE", true);
        delete RadioInfo.onSignalSourceChange;
    });

});
