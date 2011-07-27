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
var event = require('ripple/event'),
    _console = require('ripple/console'),
    app = require('ripple/app'),
    exception = require('ripple/exception'),
    notifications = require('ripple/notifications'),
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    platform = require('ripple/platform'),
    _self;

event.on("ScreenChangeDimensions", function (width, height) {
    var eventToFire = document.createEvent("Event");
    _console.log(platform.current().name + " :: Firing resolution changed event for width: " + width + " and height: " + height);
    eventToFire.height = height;
    eventToFire.width = width;
    eventToFire.initEvent("resolution", false, false);
    window.dispatchEvent(eventToFire);
});

event.on("WidgetShow", function () {
    if (_self.onShow) {
        _self.onShow();
    }
});

event.on("WidgetHide", function () {
    if (_self.onHide) {
        _self.onHide();
    }
});

_self = {
    // read only
    originalURL: "",
    identifier: "",
    widgetMode: "application",

    onShow: null,
    onHide: null,

    openUrl: function (url) {
        window.open(url);
    },

    setPreferenceForKey: function (preference, key) {
        utils.validateNumberOfArguments(1, 2, arguments.length);
        utils.validateArgumentType(key, "string");

        var msg = platform.current().name + " :: ",
            prefix = platform.getPersistencePrefix();

        if (app.isPreferenceReadOnly(key)) {
            msg += "Cannot modify a read only preference. Preference key: " + key;
        }
        else {
            if (preference === null) {
                msg += "deleting preference " + key;
                db.remove(key, prefix);
            }
            else {
                msg += "setting preference " + key + " == " + preference;
                utils.validateArgumentType(preference, "string");
                db.save(key, preference, prefix);
            }
        }

        _console.log(msg);
        event.trigger("StorageUpdatedEvent");
    },

    preferenceForKey: function (key) {
        utils.validateNumberOfArguments(1, 1, arguments.length);
        utils.validateArgumentType(key, "string");

        var prefix = platform.getPersistencePrefix(),
            value = db.retrieve(key, prefix) || undefined;

        _console.log(platform.current().name + " :: retrieving preference " + key + " == " + value);

        return value;
    },

    hide: function () {
        exception.raise(exception.types.MethodNotImplemented, "The hide method is not yet implemented");
    },

    show: function () {
        exception.raise(exception.types.MethodNotImplemented, "The show method is not yet implemented");
    },

    getAttention: function () {
        notifications.openNotification("Hi i''m getting your attention!!!!");
    },

    showNotification: function (message, callback) {
        notifications.openNotification(message);

        if (callback) {
            callback.apply();
        }
    },

    addEventListener: function (type, expression, bubbling) {
        _console.log(platform.current().name + " :: Adding Widget Event Listener for type == " + type);
        bubbling = bubbling || false;
        window.addEventListener(type, expression, bubbling);
    },

    removeEventListener: function (type, listener, useCapture) {
        _console.log(platform.current().name + " :: Removing a Widget Event Listener for type == " + type);
        window.removeEventListener(type, listener, useCapture);
    }
};

module.exports = _self;
