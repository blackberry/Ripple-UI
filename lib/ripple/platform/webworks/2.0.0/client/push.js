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
var transport = require('ripple/platform/webworks/2.0.0/client/transport'),
    _self,
    _uri = "blackberry/push/onPush",
    callbacks = {},
    PushData = require('ripple/platform/webworks/2.0.0/client/PushData');

_self = {
    openPushListener: function (callback, port, bbTransport, maxQueueCap) {
        callbacks["onPush" + port] = callback;

        transport.poll(_uri, {
            get: {
                port: port,
                bbTransport: bbTransport,
                maxQueueCap: maxQueueCap
            }
        }, function (response) {
            var func = callbacks["onPush" + port];

            if (func) {
                func(new PushData(response.data, port));
            }

            return !!func;
        });
    },

    closePushListener: function (port) {
        delete callbacks["onPush" + port];
    }
};

module.exports = _self;
