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
var _console = require('ripple/console');

function _getStack(depth) {
    var caller,
        stack = "",
        count = 0;

    try {
        caller = arguments.callee.caller.arguments.callee.caller;

        while (count <= depth && caller) {
            stack += "function: " + caller.toString().match(/function\s?(.*)\{/)[1] + "\n";
            caller = caller.arguments.callee.caller;
            count++;
        }
    } catch (e) {
        stack = "failed to determine stack trace (" + (e.name || e.type) + " :: " + e.message + ")";
    }

    return stack;
}

module.exports = {

    types: {
        Application: "Application",
        ArgumentLength: "ArgumentLength",
        ArgumentType: "ArgumentType",
        Argument: "Argument",
        NotificationType: "NotificationType",
        NotificationStateType: "NotificationStateType",
        DomObjectNotFound: "DomObjectNotFound",
        LayoutType: "LayoutType",
        DeviceNotFound: "DeviceNotFound",
        tinyHipposMaskedException: "tinyHipposMaskedException",
        Geo: "Geo",
        Accelerometer: "Accelerometer",
        MethodNotImplemented: "MethodNotImplemented",
        InvalidState: "InvalidState",
        ApplicationState: "ApplicationState"
    },

    handle: function handle(exception, reThrow) {
        reThrow = reThrow || false;

        var eMsg = exception.message || "exception caught!",
        msg = eMsg + "\n\n" + (exception.stack || "*no stack provided*") + "\n\n";

        _console.error(msg);

        if (reThrow) {
            throw exception;
        }
    },

    raise: function raise(exceptionType, message, customExceptionObject) {
        var obj = customExceptionObject || {
                type: "",
                message: "",

                toString: function () {
                    var result = this.name + ': "' + this.message + '"';

                    if (this.stack) {
                        result += "\n" + this.stack;
                    }
                    return result;
                }
            };

        message = message || "";

        obj.name = exceptionType;
        obj.type = exceptionType;
        // TODO: include the exception objects original message if exists
        obj.message = message;
        obj.stack = _getStack(5);

        throw obj;
    },

    throwMaskedException: function throwMaskedException(exceptionType, message, customExceptionObject) {
        try {
            this.raise.apply(this, arguments);
        } catch (e) {
            this.handle(e);
        }
        this.raise(this.types.tinyHipposMaskedException, "tinyhippos terminated your script due to exception");
    }

};
