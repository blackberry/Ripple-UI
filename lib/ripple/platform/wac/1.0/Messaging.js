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
var exception = require('ripple/exception'),
    utils = require('ripple/utils'),
    constants = require('ripple/constants'),
    notifications = require('ripple/notifications'),
    _console = require('ripple/console'),
    Message = require('ripple/platform/wac/1.0/Message'),
    MessageTypes = require('ripple/platform/wac/1.0/MessageTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes');

function _throwUnsupportedException(method) {
    exception.raise(ExceptionTypes.UNSUPPORTED, "Method not supported." + (method || ""), new Exception());
}

module.exports = {
    onMessageArrived: undefined,
    onMessageSendingFailure: undefined,
    onMessagesFound: undefined,

    createMessage: function (messageType) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER, "createMessage invalid number of arguments", new Exception());
        utils.validateArgumentType(messageType, "string", ExceptionTypes.INVALID_PARAMETER, "createMessage invalid arguments", new Exception());

        if (!utils.some(MessageTypes, function (value) {
                return value === messageType;
            })) {
            exception.raise(ExceptionTypes.INVALID_PARAMETER, "createMessage invalid arguments", new Exception());
        }

        var message = new Message();
        message.messageType = messageType;

        return message;
    },
    deleteMessage: function () {
        _throwUnsupportedException("Messaging.deleteMessage");
    },
    getMessage: function () {
        _throwUnsupportedException("Messaging.getMessage");
    },
    getMessageQuantities: function () {
        _throwUnsupportedException("Messaging.getMessageQuantities");
    },
    sendMessage: function (msg) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.UNSUPPORTED, "sendMessage invalid number of arguments", new Exception());
        if (msg instanceof Message === false) {
            exception.raise(ExceptionTypes.INVALID_PARAMETER, "expected a valid Message object", new Exception());
        }

        //TODO: Must be modded to fail and to then call the onMessageSendingFailure callback
        var message = "Sent " + msg.messageType + " " + msg.messageId + " to " + msg.destinationAddress;

        // insert fail check here
        notifications.openNotification(constants.NOTIFICATIONS.TYPES.NORMAL, message);
        _console.log(message);
    },
    moveMessageToFolder: function () {
        _throwUnsupportedException("Messaging.moveMessageToFolder");
    },
    copyMessageToFolder: function () {
        _throwUnsupportedException("Messaging.copyMessageToFolder");
    },
    createFolder: function () {
        _throwUnsupportedException("Messaging.createFolder");
    },
    deleteFolder: function () {
        _throwUnsupportedException("Messaging.deleteFolder");
    },
    getFolderNames: function () {
        _throwUnsupportedException("Messaging.getFolderNames");
    },
    findMessages: function () {
        _throwUnsupportedException("Messaging.findMessages");
    },
    getCurrentEmailAccount: function () {
        _throwUnsupportedException("Messaging.getCurrentEmailAccount");
    },
    getEmailAccounts: function () {
        _throwUnsupportedException("Messaging.getEmailAccounts");
    },
    setCurrentEmailAccount: function () {
        _throwUnsupportedException("Messaging.setCurrentEmailAccount");
    },
    deleteEmailAccount: function () {
        _throwUnsupportedException("Messaging.deleteEmailAccount");
    }

};
