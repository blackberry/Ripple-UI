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
describe("wac_Config", function () {
    var Config = require('ripple/platform/wac/1.0/Config'),
        ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
        deviceSettings = require('ripple/deviceSettings'),
        platform = require('ripple/platform');

    beforeEach(function () {
        spyOn(platform, "current").andReturn({
            device: {
                "Config": {
                    "msgRingtoneVolume": {control: {value: 5}},
                    "ringtoneVolume": {control: {value: 3}},
                    "vibrationSetting": {control: {value: "off"}}
                }
            }
        });
    });

    it("msgRingtoneVolume should return a default control value", function () {
        expect(Config.msgRingtoneVolume).toEqual(5);
    });

    it("msgRingtoneVolume should return a registered value", function () {
        deviceSettings.register("Config.msgRingtoneVolume", 7);
        expect(Config.msgRingtoneVolume).toEqual(7);
        deviceSettings.register("Config.msgRingtoneVolume", null);
    });

    it("ringtoneVolume should by default return default control", function () {
        expect(Config.ringtoneVolume).toEqual(3);
    });

    it("ringtoneVolume shuold return a registered value", function () {
        deviceSettings.register("Config.ringtoneVolume", 2);
        expect(Config.ringtoneVolume).toEqual(2);
        deviceSettings.register("Config.ringtoneVolume", null);
    });

    it("vibrationSetting should by default return default control", function () {
        expect(Config.vibrationSetting).toEqual("off");
    });

    it("vibrationSetting should return a registered valid string", function () {
        deviceSettings.register("Config.vibrationSetting", "on");
        expect(Config.vibrationSetting).toEqual("on");
        deviceSettings.register("Config.vibrationSetting", null);
    });

    it("setDefaultRingtone throws no exception when valid call", function () {
        expect(function () {
            Config.setDefaultRingtone("/some/path");
        }).not.toThrow();
    });

    it("setDefaultRingtone should throw a exception when invalid paramter is passed", function () {
        var caught = false;
        try {
            Config.setDefaultRingtone(5);
        } catch (e) {
            if (e.name === ExceptionTypes.INVALID_PARAMETER || e.type === ExceptionTypes.INVALID_PARAMETER) {
                caught = true;
            }
        }
        expect(caught).toEqual(true);
    });
});
