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
    platform = require('ripple/platform'),
    exception = require('ripple/exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    _self;

event.on("ScreenChangeDimensions", function (height, width) {
    try {
        // TODO: are these per spec to call?
        if (typeof app.onMaximize === 'function') {
            app.onMaximize();
        }
        if (typeof app.onRestore === 'function') {
            app.onRestore();
        }
        _console.log("called Widget.onRestore and Widget.onMaximize callback function");
    }
    catch (e) {
        exception.handle(e, false);
    }
});

event.on("WidgetWakeup", function () {
    if (_self.onWakeup) {
        _self.onWakeup();
    }
});

event.on("WidgetMaximize", function () {
    if (_self.onMaximize) {
        _self.onMaximize();
    }
});

event.on("WidgetFocus", function () {
    if (_self.onFocus) {
        _self.onFocus();
    }
});

event.on("WidgetRestore", function () {
    if (_self.onRestore) {
        _self.onRestore();
    }
});

_self = {
    onWakeup: undefined,
    onMaximize: undefined,
    onFocus: undefined,
    onRestore: undefined,

    openURL: function (url) {
        window.open(url);
    },

    setPreferenceForKey: function (value, key) {

        utils.validateNumberOfArguments(1, 2, arguments.length, ExceptionTypes.INVALID_PARAMETER, "setPreferenceForKey invalid number of paramters", new Exception());
        utils.validateArgumentType(key, "string", ExceptionTypes.INVALID_PARAMETER, "setPreferenceForKey invalid parameter! Key:" +
            key + ", Value: " + value, new Exception());

        var msg = "",
            prefix;
        if (app.isPreferenceReadOnly(key)) {
            msg += "Cannot modify a read only preference. Preference key: " + key;
        }
        else {
            prefix = platform.getPersistencePrefix();
            if (value === null) {
                msg += "deleting preference " + key;
                db.remove(key, prefix);
            }
            else {
                msg += "setting preference " + key + " == " + value;
                utils.validateArgumentType(value, "string", ExceptionTypes.INVALID_PARAMETER, msg, new Exception());
                db.save(key, value, prefix);
            }
        }


        _console.log(msg);

        // Trigger storageUpdatedEvent
        event.trigger("StorageUpdatedEvent");

    },

    // return value or undefined
    preferenceForKey: function (key) {

        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER, "preferenceForKey invalid number of parameters", new Exception());
        utils.validateArgumentType(key, "string", ExceptionTypes.INVALID_PARAMETER, "preferenceForKey invalid paramters", new Exception());

        var prefix = platform.getPersistencePrefix(),
            value = db.retrieve(key, prefix);

        if (!value && value !== "") {
            value = undefined;
        }

        _console.log("retrieving preference " + key + " == " + value);

        return value;

    }
};

module.exports = _self;
