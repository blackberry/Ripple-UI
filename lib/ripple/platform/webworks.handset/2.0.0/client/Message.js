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
var utils = require('ripple/platform/webworks.core/2.0.0/client/utils'),
    identity = require('ripple/platform/webworks.handset/2.0.0/client/identity'),
    transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    Service = require('ripple/platform/webworks.handset/2.0.0/client/identity/Service'),
    select = require('ripple/platform/webworks.core/2.0.0/select'),
    _uri = "blackberry/message/message/";

function Message(service) {
    var _service = service,
        _msg = {
            uid: 0,
            status: Message.STATUS_DRAFT,
            from: "",
            folder: Message.FOLDER_DRAFT,
            replyTo: "",
            bccRecipients: "",
            body: "",
            ccRecipients: "",
            priority: Message.PRIORITY_MEDIUM, //default to med priority
            subject: "",
            toRecipients: "",

            remove: function () {
                _msg.folder = Message.FOLDER_DELETED;
                transport.call(_uri + "remove", {
                    get: {uid: _msg.uid}
                });
            },

            save: function () {
                if (_msg.uid === 0) {
                    _msg.uid = Number(Math.uuid(8, 10));
                }

                _msg.replyTo  = _msg.from = _service.emailAddress;
                _msg.status =  Message.STATUS_SAVED;
                transport.call(_uri + "save", {
                    post: {message: _msg}
                });
            },

            send: function () {
                if (_msg.toRecipients) {
                    if (_msg.uid === 0) {
                        _msg.uid = Number(Math.uuid(8, 10));
                    }

                    _msg.folder = Message.FOLDER_DRAFT;
                    _msg.status = Message.STATUS_UNKNOWN;
                    transport.call(_uri + "send", {
                        get: {message: _msg}
                    });
                } else {
                    throw "message has no recipients";
                }
            }
        };

    if (!_service) {
        _service = identity.getDefaultService().reduce(function (email, service) {
            return service.type === Service.TYPE_EMAIL ? service : email;
        }, null);
    }

    return _msg;
}

Message.find = function (filter, maxReturn, service) {
    var opts = {
        post: {
            filter: filter,
            maxReturn: maxReturn,
            service: service
        }
    };

    return transport.call(_uri + "find", opts).map(function (obj) {
        var msg = new Message();

        msg.uid = obj.uid;
        msg.status = obj.status;
        msg.from = obj.from;
        msg.folder = obj.folder;
        msg.replyTo = obj.replyTo;
        msg.bccRecipients = obj.bccRecipients;
        msg.body = obj.body;
        msg.ccRecipients = obj.ccRecipients;
        msg.priority = obj.priority;
        msg.subject = obj.subject;
        msg.toRecipients = obj.toRecipients;

        return msg;
    });
};


Message.__defineGetter__("STATUS_UNKNOWN", function () {
    return -1;
});
Message.__defineGetter__("STATUS_SAVED", function () {
    return 0;
});
Message.__defineGetter__("STATUS_DRAFT", function () {
    return 1;
});
Message.__defineGetter__("STATUS_SENT", function () {
    return 2;
});
Message.__defineGetter__("STATUS_ERROR_OCCURED", function () {
    return 3;
});
Message.__defineGetter__("PRIORITY_HIGH", function () {
    return 0;
});
Message.__defineGetter__("PRIORITY_MEDIUM", function () {
    return 1;
});
Message.__defineGetter__("PRIORITY_LOW", function () {
    return 2;
});
Message.__defineGetter__("FOLDER_INBOX", function () {
    return 0;
});
Message.__defineGetter__("FOLDER_SENT", function () {
    return 1;
});
Message.__defineGetter__("FOLDER_DRAFT", function () {
    return 2;
});
Message.__defineGetter__("FOLDER_OUTBOX", function () {
    return 3;
});
Message.__defineGetter__("FOLDER_DELETED", function () {
    return 4;
});
Message.__defineGetter__("FOLDER_OTHER", function () {
    return 5;
});

module.exports = Message;
