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
var app = require('ripple/app'),
    notifications = require('ripple/notifications'),
    utils = require('ripple/utils'),
    permissions = app.getInfo().permissions,
    _sandbox = true,
    _self = {};

_self.__defineSetter__("sandbox", function (sandbox) {
    utils.validateArgumentType(sandbox, "boolean", "sandbox cannot be set!");
    if (sandbox === false) {
        if (!utils.some(permissions, function (item) {
                return item === "access_shared";
            })) {
            notifications.openNotification("error", "You're asking for a non-sandboxed file system, however you have not specified the access_shared permission in config.xml under the rim:permissions node");
        }
    }

    if (_sandbox !== sandbox) {
        if (sandbox === false) {
            // no idea what to do here
        }
        _sandbox = sandbox;
    }
});

_self.__defineGetter__("sandbox", function () {
    return _sandbox;
});

_self.__defineGetter__("SDCard", function () {
    return "/webworksBB10/SDCard";
});

_self.__defineGetter__("home", function () {
    return "/webworksBB10/" + app.getInfo().id + "/home";
});

_self.__defineGetter__("sharedFolder", function () {
    return "/webworksBB10/sharedFolder";
});

module.exports = _self;
