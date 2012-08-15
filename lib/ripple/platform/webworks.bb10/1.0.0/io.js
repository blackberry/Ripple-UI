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
    appId = app.getInfo().id,
    utils = require('ripple/utils'),
    _sandbox,
    _self = {};

_self.__defineSetter__("sandbox", function (sandbox) {
    utils.validateArgumentType(sandbox, "boolean", "sandbox cannot be set!");
    _sandbox = sandbox;
    //do stuff with things
});

_self.__defineGetter__("sandbox", function () {
    return _sandbox;
});

_self.__defineGetter__("SDCard", function () {
    return "/webworksBB10/SDCard";
});

_self.__defineGetter__("home", function () {
    return "/webworksBB10/" + id + "/home";
});

_self.__defineGetter__("sharedFolder", function () {
    return "/webworksBB10/sharedFolder";
});

module.exports = _self;
