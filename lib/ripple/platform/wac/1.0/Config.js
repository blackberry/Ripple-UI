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
var utils = require('ripple/utils'),
    notifications = require('ripple/notifications'),
    constants = require('ripple/constants'),
    deviceSettings = require('ripple/deviceSettings'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    _self = {
        ringtoneVolume: undefined,
        msgRingtoneVolume: undefined,
        vibrationSetting: undefined,

        setDefaultRingtone: function (ringtoneUrl) {
            utils.validateArgumentType(ringtoneUrl, "string", ExceptionTypes.INVALID_PARAMETER, "ringtoneUrl paramter is not a string", new Exception());
            notifications.openNotification("normal", "Setting default ringtone to: " + ringtoneUrl);
        },

        setAsWallpaper: function (wallpaperUrl) {
            utils.validateArgumentType(wallpaperUrl, "string", ExceptionTypes.INVALID_PARAMETER, "wallpaperUrl paramter is not a string", new Exception());
            notifications.openNotification("normal", "Setting wallpaper to: " + wallpaperUrl);
        }
    };

_self.__defineGetter__("ringtoneVolume", function () {
    return deviceSettings.retrieve("Config.ringtoneVolume");
});

_self.__defineGetter__("msgRingtoneVolume", function () {
    return deviceSettings.retrieve("Config.msgRingtoneVolume");
});

_self.__defineGetter__("vibrationSetting", function () {
    return deviceSettings.retrieve("Config.vibrationSetting");
});

module.exports = _self;
