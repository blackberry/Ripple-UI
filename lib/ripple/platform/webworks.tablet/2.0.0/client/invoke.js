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
    APP_TYPE = "appType",
    APP_URL_CAMERA = "camera://",
    APP_URL_CAMERA_VIDEO = "camera://video",
    APP_URL_MAP = "map://",
    APP_URL_MUSIC = "music://",
    APP_URL_PHOTOS = "photos://",
    APP_URL_VIDEOS = "videos://",
    APP_URL_APPWORLD = "appworld://",
    APP_URL_UPDATE = "update://",
    APP_TYPE_ERROR = "appType not supported",
    APP_BROWSER_ERROR = "Protocol specified in the url is not supported.",
    transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    _self;

_self = {
    invoke: function (appType, args) {
        var get = {};

        switch (appType) {

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
                        throw APP_BROWSER_ERROR;
                    }
                    else {
                        get.appType = args.url;
                    }
                }
            }
            break;

        //Music
        case 13:
            get.appType = APP_URL_MUSIC;
            break;

        //Photos
        case 14:
            get.appType = APP_URL_PHOTOS;
            break;

        //Videos
        case 15:
            get.appType = APP_URL_VIDEOS;
            break;

        //AppWorld
        case 16:
            get.appType = APP_URL_APPWORLD;
            break;

        //Update
        case 17:
            get.appType = APP_URL_UPDATE;
            break;

        default:
            throw APP_TYPE_ERROR;
        }

        transport.call(_uri, {
            get: get,
            async: true
        });
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
