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
var _isListening = false,
    notifications = require('ripple/notifications'),
    event = require('ripple/event'),
    _console = require('ripple/console'),
    _onReceive,
    _self;

event.on("MessageReceived", function (message) {
    if (!_isListening || message.type !== 'sms') {
        return;
    }

    var baton = _onReceive;
    _onReceive = null;
    _isListening = false;
    return baton && baton.pass({code: 1, data: message});
});

_self = {
    onReceive: function (args, post, baton) {
        baton.take();
        _onReceive = baton;
        _isListening = !!_onReceive;
    },

    send: function (args) {
        var msg = "To " + args.address + ": " + args.message;
        notifications.openNotification("normal", msg);
        _console.log(msg);
        return {code: 1};
    },

    isListeningForMessage: function (get) {
        if (get && typeof get.isListeningForMessage === "boolean") {
            _isListening = get.isListeningForMessage;
        }

        return {code: 1, data: _isListening};
    }
};

module.exports = _self;
