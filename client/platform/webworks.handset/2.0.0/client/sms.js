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
var transport = require('ripple/client/platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/message/sms/",
    onReceive,
    _self;

_self = {
    addReceiveListener: function (callback) {
        onReceive = callback;
        transport.poll(_uri + "onReceive", {}, function (response) {
            if (onReceive) {
                onReceive(response.body, response.from, response.time);
            }
            return !!onReceive;
        });
    },

    removeReceiveListener: function () {
        if (onReceive) {
            onReceive = null;
            return true;
        }

        return false;
    },

    send: function (message, address) {
        transport.call(_uri + "send", {
            get: {
                message: message,
                address: address
            },
            async: true
        });
    }
};

_self.__defineGetter__("isListeningForMessage", function () {
    return transport.call(_uri + "isListeningForMessage", {async: false});
});

_self.__defineSetter__("isListeningForMessage", function (value) {
    transport.call(_uri + "isListeningForMessage", {
        async: false,
        get: {isListeningForMessage: value}
    });
});

module.exports = _self;
