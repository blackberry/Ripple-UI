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
var _uri = "blackberry/invoke/invoke",
    APP_URL_CAMERA = "camera://",
    APP_URL_CAMERA_VIDEO = "camera://video",
    APP_URL_BROWSER = "http://",
    APP_URL_MAP = "map://",
    APP_URL_MUSIC = "music://",
    APP_URL_PHOTOS = "photos://",
    APP_URL_VIDEOS = "videos://",
    APP_URL_APPWORLD = "appworld://",
    APP_URL_UPDATE = "update://",
    APP_BROWSER_ERROR = "Protocol specified in the url is not supported.",
    APP_ADDRESSBOOK_ERROR = "Invalid arguments specified",
    transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    _self;

_self = {
    invoke: function (appType, args) {
        var get = {};

        switch (appType) {

        //AddressBook
        case 0:
            if (args) {
                if (args.view === 1 && args.contact) {
                    throw APP_ADDRESSBOOK_ERROR; //contact cannot be used with this view
                }
                else if (args.view === 2 && !args.contact) {
                    throw APP_ADDRESSBOOK_ERROR; //need contact for this view
                }
            }
            break;

        //Bluetooth Config
        case 1:
            get.appType = appType;
            break;

        //Calculator
        case 2:
            get.appType = appType;
            break;

        //Calendar
        case 3:
            get.appType = appType;
            break;

        //Camera
        case 4:
            if (!args || args.view === 1) {
                get.appType = APP_URL_CAMERA_VIDEO;
            } else {
                get.appType = APP_URL_CAMERA;
            }
            break;

        //Maps
        case 5:
            get.appType = APP_URL_MAP;
            break;

        //Memopad
        case 6:
            get.appType = appType;
            break;

        //Messages
        case 7:
            get.appType = appType;
            break;

        //Phone
        case 8:
            get.appType = appType;
            break;

        //Search
        case 9:
            get.appType = appType;
            break;

        //Tasks
        case 10:
            get.appType = appType;
            break;

        //Browser
        case 11:

            if (!args) {
                get.appType = APP_URL_BROWSER;
            } else {
                //Only http:// works to launch the browser
                if (args.url.indexOf(APP_URL_BROWSER) !== 0) {
                    throw APP_BROWSER_ERROR;
                }
                get.appType = args.url;
            }

            break;

        //Java
        case 12:
            get.appType = appType;
            break;

        default:
            throw "appType not supported";
        }

        transport.call(_uri, {
            get: get,
            async: true
        });
    }
};

_self.__defineGetter__("APP_ADDRESSBOOK", function () {
    return 0;
});
_self.__defineGetter__("APP_BLUETOOTH_CONFIG", function () {
    return 1;
});
_self.__defineGetter__("APP_CALCULATOR", function () {
    return 2;
});
_self.__defineGetter__("APP_CALENDAR", function () {
    return 3;
});
_self.__defineGetter__("APP_CAMERA", function () {
    return 4;
});
_self.__defineGetter__("APP_MAPS", function () {
    return 5;
});
_self.__defineGetter__("APP_MEMOPAD", function () {
    return 6;
});
_self.__defineGetter__("APP_MESSAGES", function () {
    return 7;
});
_self.__defineGetter__("APP_PHONE", function () {
    return 8;
});
_self.__defineGetter__("APP_SEARCH", function () {
    return 9;
});
_self.__defineGetter__("APP_TASKS", function () {
    return 10;
});
_self.__defineGetter__("APP_BROWSER", function () {
    return 11;
});
_self.__defineGetter__("APP_JAVA", function () {
    return 12;
});

module.exports = _self;
