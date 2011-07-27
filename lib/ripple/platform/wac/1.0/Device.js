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
    exception = require('ripple/platform'),
    _console = require('ripple/console'),
    platform = require('ripple/platform'),
    utils = require('ripple/utils'),
    notifications = require('ripple/notifications'),
    ApplicationTypes = require('ripple/platform/wac/1.0/ApplicationTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    _applicationTypes = {
        FILES: "FILES",
        MEDIAPLAYER: "MEDIAPLAYER",
        PHONECALL: "PHONECALL",
        PICTURES: "PICTURES"
    },
    _self;

function _throwUnsupportedException(method) {
    exception.raise(ExceptionTypes.UNSUPPORTED, "Method not supported." + (method || ""), new Exception());
}

_self = {
    // Properties
    clipboardString: undefined,
    widgetEngineName: undefined,
    widgetEngineProvider: undefined,
    widgetEngineVersion: undefined,

    // Methods
    getAvailableApplications: function () {
        return constants.PLATFORMS.WAC.APPLICATIONS || [];
    },

    getDirectoryFileNames: function () {
        _throwUnsupportedException("Device.getDirectoryFileNames");
    },
    getFile: function () {
        _throwUnsupportedException("Device.getFile");
    },

    launchApplication: function launchApplication(application, startParameter) {
        if (!application || typeof(application) !== "string") {
            exception.raise(ExceptionTypes.INVALID_PARAMETER,
                    "Invalid argument 'application' at Device.launchApplication(): expected to be of type 'string' but was of type: " + (application ? typeof(application) : "null"),
                    Exception);
        }

        if (startParameter && typeof(startParameter) !== "string") {
            exception.raise(ExceptionTypes.INVALID_PARAMETER,
                    "Invalid argument 'startParameter' at Device.launchApplication(): expected to be 'string' but was : " + typeof(startParameter),
                    Exception);
        }

        // rudimentary implementation for now
        var message = "The widget has requested application: '" + application + "' to be launched. \n\n";

        if (startParameter) {
            message += "The following start parameter was sent in: " + startParameter + "\n\n";
        }

        if (_applicationTypes[application] && !startParameter) {
            message += "Launching this application can also be done with an optional startParameter which was not provided" + "\n\n";
        }

        if (!ApplicationTypes[application]) {
            message += "Note: the application requested is not part of the common values specified by the WAC API.";
        }

        notifications.openNotification(constants.NOTIFICATIONS.TYPES.NORMAL, message);
        _console.log(platform.current().name + " :: " + message);
    },

    copyFile: function () {
        _throwUnsupportedException("Device.copyFile");
    },
    deleteFile: function () {
        _throwUnsupportedException("Device.deleteFile");
    },
    findFiles: function () {
        _throwUnsupportedException("Device.findFiles");
    },
    getFileSystemRoots: function () {
        _throwUnsupportedException("Device.getFileSystemRoots");
    },
    getFileSystemSize: function () {
        _throwUnsupportedException("Device.getFileSystemSize");
    },
    moveFile: function () {
        _throwUnsupportedException("Device.moveFile");
    },
    onFilesFound: function () {
        _throwUnsupportedException("Device.onFilesFound");
    },
    setRingtone: function () {
        _throwUnsupportedException("Device.setRingtone");
    },

    vibrate: function (duration) {
        utils.validateArgumentType(duration, "number", ExceptionTypes.INVALID_PARAMETER, "duration paramter is not a number", new Exception());
        notifications.openNotification(constants.NOTIFICATIONS.TYPES.NORMAL, "Vibrating for " + duration + " second(s).");
    }

};

_self.__defineGetter__("widgetEngineName", function () {
    return constants.PLATFORMS.WAC.DEVICE.WIDGET_ENGINE_NAME;
});

_self.__defineGetter__("widgetEngineProvider", function () {
    return constants.PLATFORMS.WAC.DEVICE.WIDGET_ENGINE_PROVIDER;
});

_self.__defineGetter__("widgetEngineVersion", function () {
    return constants.PLATFORMS.WAC.DEVICE.WIDGET_ENGINE_VERSION;
});

module.exports = _self;
