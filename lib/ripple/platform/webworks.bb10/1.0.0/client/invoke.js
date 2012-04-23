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

var notifications = require('ripple/notifications'),
    _self;

_self = {
    invoke: function (appType, args) {
        var get = {};

        switch (appType) {

        //Browser
        case 11:

            if (!args) {
                get.appType = "http://";
            }
            else {
                get.appType = args.url.split("://");

                if (get.appType.length === 1) {
                    get.appType = "http://" + get.appType[0];
                }
                else if (get.appType.length === 2) {
                    if (get.appType[0].indexOf("http") !== 0) {
                        throw "Protocol specified in the url is not supported.";
                    }
                    else {
                        get.appType = args.url;
                    }
                }
            }

            notifications.openNotification("normal", "Requested to launch: Browser. For the following URL: " + args.url);

            break;

        default:
            throw "appType not supported";
        }
    }
};

_self.__defineGetter__("APP_CAMERA", function () {
    return 4;
});
_self.__defineGetter__("APP_MAPS", function () {
    return 5;
});
_self.__defineGetter__("APP_BROWSER", function () {
    return 11;
});
_self.__defineGetter__("APP_MUSIC", function () {
    return 13;
});
_self.__defineGetter__("APP_PHOTOS", function () {
    return 14;
});
_self.__defineGetter__("APP_VIDEOS", function () {
    return 15;
});
_self.__defineGetter__("APP_APPWORLD", function () {
    return 16;
});

module.exports = _self;
