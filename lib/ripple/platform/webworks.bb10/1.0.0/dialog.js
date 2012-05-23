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
var _self,
    constants = require('ripple/constants'),
    ui = require('ripple/ui'),
    event = require('ripple/event'),
    isDialogVisible = false,
    visibleDialogArgs,
    utils = require('ripple/utils');

function getButtonsForDialogType(dialogType) {
    switch (dialogType) {
    case _self.D_OK:
        return ["Ok"];
    case _self.D_SAVE:
        return ["Save", "Discard"];
    case _self.D_DELETE:
        return ["Delete", "Cancel"];
    case _self.D_YES_NO:
        return ["Yes", "No"];
    case _self.D_OK_CANCEL:
        return ["Ok", "Cancel"];
    default:
        throw new Error("Invalid dialog type: " + dialogType);
    }
}

event.on("LayoutChanged", function () {
    if (isDialogVisible) {
        closeDialog();
        //Used to resize dialog on orientation change
        _self.ask(visibleDialogArgs);
    }
});

function closeDialog() {
    var buttonsDiv = document.getElementById("dialog-buttons"),
        messageDiv = document.getElementById("dialog-message");

    ui.hideOverlay("dialog-window", function (dialog) {
        buttonsDiv.innerHTML = "";
        messageDiv.innerHTML = "";
        isDialogVisible = false;
    });
}

function ask(args, callback) {
    if (!args) {
        throw ("No arguments provided");
    } else if (!args.buttons || !args.message) {
        throw ("Invalid arguments");
    }
    visibleDialogArgs = args;

    ui.showOverlay("dialog-window", function (dialog) {
        var container = document.getElementById(constants.COMMON.VIEWPORT_CONTAINER),
            height = window.getComputedStyle(container, null).getPropertyValue("height"),
            width = window.getComputedStyle(container, null).getPropertyValue("width"),
            sizeDiv = document.getElementById("dialog-wrapper"),
            positionDiv = document.getElementById("dialog-window"),
            titleDiv = document.getElementById("dialog-title"),
            buttonsDiv = document.getElementById("dialog-buttons"),
            messageDiv = document.getElementById("dialog-message"),
            position, size;

        if (!messageDiv || !buttonsDiv) {
            return;
        }

        dialog.setAttribute("style", "display:-webkit-box;height:" + height + "; width:" + width + ";");

        position = "overlay-dialog";
        size = "overlay-dialog-wrapper";

        if (args.settings && args.settings.position) {
            position += " overlay-dialog-" + args.settings.position;
        }

        if (args.settings && args.settings.size) {
            size += " overlay-dialog-wrapper-" + args.settings.size;
        }

        positionDiv.setAttribute("class", position);
        sizeDiv.setAttribute("class", size);

        titleDiv.innerHTML = args.settings && args.settings.title ? args.settings.title : "";
        messageDiv.innerHTML = args.message;
        isDialogVisible = true;

        args.buttons.forEach(function (button) {
            var buttonElement = utils.createElement("input", {
                "type": "button",
                "value": button
            });
            buttonElement.addEventListener("click", function () {
                var buttonIndex = args.buttons.indexOf(button);
                closeDialog();
                callback(buttonIndex);
            });
            buttonsDiv.appendChild(buttonElement);
        });
    }, true);
}

_self = {
    customAskAsync: function (message, choices, callback, settings) {
        ask({
            message: message,
            buttons: choices,
            settings: settings
        }, function (response) {
            if (callback) {
                callback(response);
            }
        });
    },

    standardAskAsync: function (message, type, callback, settings) {
        var choices = getButtonsForDialogType(type);
        ask({ 
            message: message, 
            buttons: choices, 
            settings: settings
        }, function (response) {
            if (callback) {
                callback(response);
            }
        });
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

_self.__defineGetter__("BOTTOM", function () {
    return "bottomCenter";
});

_self.__defineGetter__("CENTER", function () {
    return "middleCenter";
});

_self.__defineGetter__("TOP", function () {
    return "topCenter";
});

_self.__defineGetter__("SIZE_FULL", function () {
    return "full";
});

_self.__defineGetter__("SIZE_LARGE", function () {
    return "large";
});

_self.__defineGetter__("SIZE_MEDIUM", function () {
    return "medium";
});

_self.__defineGetter__("SIZE_SMALL", function () {
    return "small";
});

_self.__defineGetter__("SIZE_TALL", function () {
    return "tall";
});

module.exports = _self;
