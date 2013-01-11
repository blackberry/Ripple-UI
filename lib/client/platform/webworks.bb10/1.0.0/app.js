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
var app = ripple('app'),
    emulatorBridge = ripple('emulatorBridge'),
    notifications = ripple('notifications'),
    _self;

_self = {
    exit: function () {
        notifications.openNotification("normal", "blackberry.app.exit() was called, in the real world your app will exit, here... you get this notification");
    }
};

_self.__defineGetter__("author", function () {
    return app.getInfo().author;
});

_self.__defineGetter__("authorEmail", function () {
    return app.getInfo().authorEmail;
});

_self.__defineGetter__("authorURL", function () {
    return app.getInfo().authorURL;
});

_self.__defineGetter__("copyright", function () {
    return app.getInfo().copyright;
});

_self.__defineGetter__("description", function () {
    var desc = app.getInfo().description;
    return desc[emulatorBridge.window().navigator.language] ||
        desc[emulatorBridge.window().navigator.language.substring(2, 0)] ||
        desc["default"];
});

_self.__defineGetter__("id", function () {
    return app.getInfo().id;
});

_self.__defineGetter__("license", function () {
    return app.getInfo().license;
});

_self.__defineGetter__("licenseURL", function () {
    return app.getInfo().licenseURL;
});

_self.__defineGetter__("name", function () {
    var name = app.getInfo().name;
    return name[emulatorBridge.window().navigator.language] ||
        name[emulatorBridge.window().navigator.language.substring(2, 0)] ||
        name["default"];
});

_self.__defineGetter__("version", function () {
    return app.getInfo().version;
});

_self.__defineGetter__("windowState", function () {
    return "fullscreen";
});

module.exports = _self;
