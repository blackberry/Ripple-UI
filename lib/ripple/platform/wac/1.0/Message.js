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
    Attachment = require('ripple/platform/wac/1.0/Attachment'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception');

function _throwUnsupportedException(method) {
    exception.raise(ExceptionTypes.UNSUPPORTED, "Method not supported." + (method || ""), new Exception());
}

module.exports = function () {
    this.messageId = Math.uuid(undefined, 16);
    this.callbackNumber = undefined;
    this.destinationAddress = [];
    this.isRead = undefined;
    this.messagePriority = undefined;
    this.messageType = undefined;
    this.subject = undefined;
    this.body = undefined;
    this.sourceAddress = undefined;
    this.validityPeriodHours = undefined;
    this.time = undefined;
    this.ccAddress = [];
    this.bccAddress = [];
    this.attachments = [];

    this.addAttachment = function (fileFullName) {
        var attachment = new Attachment();
        attachment.fileName = fileFullName;
        this.attachments.push(attachment);
    };
    this.deleteAttachment = function (attachment) {

        for (var i = this.attachments.length - 1; i >= 0; i--) {
            if (this.attachments[i].fileName === attachment.fileName) {
                this.attachments.splice(i, 1);
            }
        }
    };
    this.saveAttachment = function (fileFullName, attachment) {
        _throwUnsupportedException("Widget.Messaging.Message.addAddress");
    };
    this.addAddress = function (type, address) {

        var addresses = address.split(";");

        switch (type) {
        case "destination":
            this.destinationAddress = this.destinationAddress.concat(addresses);
            break;
        case "cc":
            this.ccAddress = this.ccAddress.concat(addresses);
            break;
        case "bcc":
            this.bccAddress = this.bccAddress.concat(addresses);
            break;
        }
    };

    this.deleteAddress = function (type, address) {
        var addresses = address.split(";"),
            filter = function (orig) {
                return orig.filter(function (address) {
                    return !addresses.some(function (x) {
                        return address === x;
                    });
                });
            };

        switch (type) {
        case "destination":
            this.destinationAddress = filter(this.destinationAddress);
            break;
        case "cc":
            this.ccAddress = filter(this.ccAddress);
            break;
        case "bcc":
            this.bccAddress = filter(this.bccAddress);
            break;
        }
    };

};
