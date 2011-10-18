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
describe("notifications", function () {
    var notifications = require('ripple/notifications'),
        exception = require('ripple/exception'),
        constants = require('ripple/constants');

    beforeEach(function () {
        var box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS),
            msgBox = document.getElementById(constants.NOTIFICATIONS.MESSAGE_TEXT_CONTAINER_CLASS);

        msgBox.innerHTML = "";
        box.setAttribute("class", "");
        box.setAttribute("style", "display: none;");
    });

    it("throws exception when opening notification with invalid type", function () {
        var nType = "test";
        expect(function () {
            notifications.openNotification(nType);
        }).toThrow(function (e) {
            return e.type === exception.types.NotificationType;
        });
    });

    it("throws exception when closing notification with invalid type", function () {
        var nType = "test";
        expect(function () {
            notifications.closeNotification(nType);
        }).toThrow(function (e) {
            return e.type === exception.types.NotificationType;
        });
    });

    it("throws exception_when opening notification if too many arguments", function () {
        expect(function () {
            notifications.openNotification("1", "2", "3", 3, true);
        }).toThrow(function (e) {
            return e.type === exception.types.NotificationType;
        });
    });

    it("throws exception_when closing notification if too many arguments", function () {
        expect(function () {
            notifications.closeNotification("1", "2", "3", 3, true);
        }).toThrow(function (e) {
            return e.type === exception.types.NotificationType;
        });
    });

    it("openNotification_throws_no_exception_when_valid_command", function () {
        var nType = "normal",
            msg = "some type of notification";
        expect(function () {
            notifications.closeNotification(nType, msg);
        }).not.toThrow();
    });

    it("openNotification_updates_dom_objects_properly_when_opening_normal_notification", function () {
        var nType = "normal",
            msg = "some type of notification",
            box, msgBox;

        notifications.openNotification(nType, msg);

        box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS);
        msgBox = document.getElementById(constants.NOTIFICATIONS.MESSAGE_TEXT_CONTAINER_CLASS);

        expect(msgBox.innerHTML).toMatch(new RegExp(msg));
        expect(box.getAttribute("style")).toEqual("display: block;");
    });

    it("closeNotification_updates_dom_objects_properly_when_closing_normal_notification", function () {
        notifications.closeNotification("normal");

        var box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS);
        expect(box.getAttribute("style")).toEqual("display: none;");
    });

    it("openNotification_updates_dom_objects_properly_when_opening_error_notification", function () {
        var nType = "error",
            msg = "type of notification",
            box, msgBox;

        notifications.openNotification(nType, msg);

        box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS);
        msgBox = document.getElementById(constants.NOTIFICATIONS.MESSAGE_TEXT_CONTAINER_CLASS);

        expect(msgBox.innerHTML).toMatch(new RegExp(msg));
        expect(box.getAttribute("style")).toEqual("display: block;");
    });

    it("closeNotification_updates_dom_objects_properly_when_closing_error_notification", function () {
        notifications.closeNotification("error");

        var box = document.getElementById(constants.NOTIFICATIONS.MAIN_CONTAINER_CLASS);
        expect(box.getAttribute("style")).toEqual("display: none;");
    });
});
