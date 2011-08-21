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
describe("wac_AccountInfo", function () {
    var AccountInfo = require('ripple/platform/wac/1.0/AccountInfo'),
        deviceSettings = require('ripple/deviceSettings'),
        platform = require('ripple/platform');

    beforeEach(function () {
        spyOn(platform, "current").andReturn({
            device: {
                "AccountInfo": {
                    "phoneUserUniqueId": {control: {value: "id"}},
                    "phoneMSISDN": {control: {value: "id"}},
                    "phoneOperatorName": {control: {value: "none"}},
                    "userSubscriptionType": {control: {value: "prepaid"}},
                    "userAccountBalance": {control: {value: 5466}}
                }
            }
        });
    });

    it("phoneUserUniqueId should return default control", function () {
        expect(AccountInfo.phoneUserUniqueId).toEqual("id");
    });

    it("phoneUserUniqueId should return a persisted value", function () {
        // not very testy
        deviceSettings.register("AccountInfo.phoneUserUniqueId", "dude");
        expect(AccountInfo.phoneUserUniqueId).toEqual("dude");
    });

    it("phoneMSISDN should return default control", function () {
        expect(AccountInfo.phoneMSISDN).toEqual("id");
    });

    it("phoneMSISDN should return a persisted value", function () {
        deviceSettings.register("AccountInfo.phoneMSISDN", "MSISDN");
        expect(AccountInfo.phoneMSISDN).toEqual("MSISDN");
    });

    it("phoneOperatorName should return a default control", function () {
        expect(AccountInfo.phoneOperatorName).toEqual("none");
    });

    it("phoneOperatorName should return a persisted value", function () {
        deviceSettings.register("AccountInfo.phoneOperatorName", "your face");
        expect(AccountInfo.phoneOperatorName).toEqual("your face");
    });

    it("userSubscriptionType should return a default control", function () {
        expect(AccountInfo.userSubscriptionType).toEqual("prepaid");
    });

    it("userSubscriptionType should return a persisted value", function () {
        deviceSettings.register("AccountInfo.userSubscriptionType", "burlesque");
        expect(AccountInfo.userSubscriptionType).toEqual("burlesque");
    });

    it("userAccountBalance should return a default control", function () {
        expect(AccountInfo.userAccountBalance).toEqual(5466);
    });

    it("userAccountBalance should return a persisted value", function () {
        deviceSettings.register("AccountInfo.userAccountBalance", 5555);
        expect(AccountInfo.userAccountBalance).toEqual(5555);
    });
});
