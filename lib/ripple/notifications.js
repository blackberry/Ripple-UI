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
var constants = require('ripple/constants'),
    exception = require('ripple/exception'),
    utils = require('ripple/utils'),
    event = require('ripple/event');

function _validateAndInitNType(nType) {
    nType = nType || "normal";

    if (nType !== "normal" && nType !== "error") {
        exception.raise(exception.types.NotificationType, "Unknown Notification Type == " + nType + ",when dealing with Console notification.");
    }

    return nType;
}

function _processNotification(nType, stateType, message) {
    nType = _validateAndInitNType(nType);
    message = message || "";

    var display,
        displayText,
        className,
        notificationIcon,
        box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS),
        msgBox = document.getElementById(constants.NOTIFICATIONS.MESSAGE_TEXT_CONTAINER_CLASS);

    className = "ui-widget";

    switch (stateType) {

    case constants.NOTIFICATIONS.STATE_TYPES.CLOSE:
        display = "display: none;"; //need to do this better.
        displayText = "";
        break;

    case constants.NOTIFICATIONS.STATE_TYPES.OPEN:
        display = "display: block;"; //need to do this better.
        displayText = message;
        if (nType === "error") {
            displayText = "Oh Snap!\n\n" + displayText;
            className += " ui-state-error ui-corner-all";
            notificationIcon = '<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>';
        }
        else {
            className += " ui-state-highlight ui-corner-all";
            notificationIcon = '<span class="ui-icon ui-icon-info" style="float: left; margin-right: .3em;"></span>';
        }
        break;

    default:
        exception.raise(exception.types.NotificationStateType, "Unknown StateType == " + stateType.toString());
    }

    msgBox.innerHTML = notificationIcon + displayText;
    box.setAttribute("class", className);
    box.setAttribute("style", display);

}

module.exports = {
    openNotification: function (nType, msg) {
        _processNotification(nType, constants.NOTIFICATIONS.STATE_TYPES.OPEN, msg);
    },

    closeNotification: function (nType) {
        _processNotification(nType, constants.NOTIFICATIONS.STATE_TYPES.CLOSE);
    }
};
