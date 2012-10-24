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
var event = require('ripple/client/event'),
    ui = require('ripple/client/ui'),
    utils = require('ripple/client/utils'),
    isDialogVisible = false,
    visibleDialogArgs,
    _self;

function closeDialog() {
    var buttonsDiv = document.getElementById("dialog-buttons"),
        messageDiv = document.getElementById("dialog-message");

    ui.hideOverlay("dialog-window", function () {
        buttonsDiv.innerHTML = "";
        messageDiv.innerHTML = "";
        isDialogVisible = false;
    });
}

event.on("LayoutChanged", function () {
    if (isDialogVisible) {
        closeDialog();
        //Used to resize dialog on orientation change
        _self.ask(visibleDialogArgs);
    }
});

_self = {

    ask: function (args, post, baton) {
        if (!args) {
            throw ("No arguments provided");
        } else if (!args.buttons || !args.message) {
            throw ("Invalid arguments");
        }
        baton.take();
        visibleDialogArgs = args;

        ui.showOverlay("dialog-window", function (dialog) {
            var container = document.getElementById("viewport-container"),
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
                    baton.pass({code: 1, data: buttonIndex});
                });
                buttonsDiv.appendChild(buttonElement);
            });
        }, true);
    }
};

module.exports = _self;
