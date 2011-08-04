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
var _self = {
    customAsk: function (message, choices, defaultChoice, globalStatus) {
        throw "not implemented";
    },

    standardAsk: function (specifies, message, defaultChoice, globalStatus) {
        throw "not implemented";
    }
};

_self.__defineGetter__("D_OK", function () {
    return 0;
});

_self.__defineGetter__("D_SAVE", function () {
    return 1;
});

_self.__defineGetter__("D_DELETE", function () {
    return 2;
});

_self.__defineGetter__("D_YES_NO", function () {
    return 3;
});

_self.__defineGetter__("D_OK_CANCEL", function () {
    return 4;
});

_self.__defineGetter__("C_CANCEL", function () {
    return -1;
});

_self.__defineGetter__("C_OK", function () {
    return 0;
});

_self.__defineGetter__("C_SAVE", function () {
    return 1;
});

_self.__defineGetter__("C_DISCARD", function () {
    return 2;
});

_self.__defineGetter__("C_DELETE", function () {
    return 3;
});

_self.__defineGetter__("C_YES", function () {
    return 4;
});

_self.__defineGetter__("C_NO", function () {
    return -1;
});

module.exports = _self;
