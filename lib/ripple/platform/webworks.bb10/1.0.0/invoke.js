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
    utils = require('ripple/utils'),
    _self = {};

function _fail(onError) {
    if (onError && typeof onError === "function") {
        onError("invalid invocation request");
    }
}

_self.invoke = function (request, onSuccess, onError) {
    var argsString = "";

    if (!request) { // is this check even needed?
        _fail(onError);
        return;
    } else {
        if (request) {
            utils.forEach(request, function (arg, key) {
                argsString += key + " = " + arg + "</br>";
            });

            notifications.openNotification("normal", "Requested to invoke external application with the following arguments:</br> " +
                                           argsString + "</br>");
        }
        else {
            _fail(onError);
            return;
        }
    }
};

_self.__defineGetter__("ACTION_OPEN", function () {
    return "bb.action.OPEN";
});
_self.__defineGetter__("ACTION_VIEW", function () { 
    return "bb.action.VIEW"; 
});
_self.__defineGetter__("ACTION_SHARE", function () {
    return "bb.action.SHARE";
});

module.exports = _self;
