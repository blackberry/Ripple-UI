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
var transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/phone/",
    _listeners = {},
    _self;

_self = {
    activeCalls: function () {
        return transport.call(_uri + "activeCalls");
    },

    addPhoneListener: function (callback, eventType) {
        var assigned = false;

        if (callback && typeof eventType === "number") {
            _listeners[eventType] = callback;
            assigned = true;
        } else if (eventType && callback === null) {
            delete _listeners[eventType];
        } else {
            _listeners = {};
        }

        transport.poll(_uri + "onPhoneEvent", {
            get: {eventType: eventType}
        }, function (response) {
            var func = _listeners[eventType];

            if (func) {
                func(response.callId, response.error);
            }

            return !!func;
        });

        // hackish (return true that event was assigned, this is a disconnect between transport poll api and server)
        return assigned;
    },

    inActiveCall: function () {
        return transport.call(_uri + "inActiveCall");
    }
};

_self.__defineGetter__("CB_CALL_INITIATED", function () {
    return 0;
});
_self.__defineGetter__("CB_CALL_WAITING", function () {
    return 1;
});
_self.__defineGetter__("CB_CALL_INCOMING", function () {
    return 2;
});
_self.__defineGetter__("CB_CALL_ANSWERED", function () {
    return 3;
});
_self.__defineGetter__("CB_CALL_CONNECTED", function () {
    return 4;
});
_self.__defineGetter__("CB_CALL_CONFERENCECALL_ESTABLISHED", function () {
    return 5;
});
_self.__defineGetter__("CB_CONFERENCECALL_DISCONNECTED", function () {
    return 6;
});
_self.__defineGetter__("CB_CALL_DISCONNECTED", function () {
    return 7;
});
_self.__defineGetter__("CB_CALL_DIRECTCONNECT_CONNECTED", function () {
    return 8;
});
_self.__defineGetter__("CB_CALL_DIRECTCONNECT_DISCONNECTED", function () {
    return 9;
});
_self.__defineGetter__("CB_CALL_ENDED_BYUSER", function () {
    return 10;
});
_self.__defineGetter__("CB_CALL_FAILED", function () {
    return 11;
});
_self.__defineGetter__("CB_CALL_RESUMED", function () {
    return 12;
});
_self.__defineGetter__("CB_CALL_HELD", function () {
    return 13;
});
_self.__defineGetter__("CB_CALL_ADDED", function () {
    return 14;
});
_self.__defineGetter__("CB_CALL_REMOVED", function () {
    return 15;
});
_self.__defineGetter__("CALL_ERROR_SUBSCRIBER_BUSY", function () {
    return 1;
});
_self.__defineGetter__("CALL_ERROR_CONGESTION", function () {
    return 2;
});
_self.__defineGetter__("CALL_ERROR_RADIO_PATH_UNAVAILABLE", function () {
    return 3;
});
_self.__defineGetter__("CALL_ERROR_NUMBER_UNOBTAINABLE", function () {
    return 4;
});
_self.__defineGetter__("CALL_ERROR_AUTHORIZATION_FAILURE", function () {
    return 5;
});
_self.__defineGetter__("CALL_ERROR_EMERGENCY_CALLS_ONLY", function () {
    return 6;
});
_self.__defineGetter__("CALL_ERROR_HOLD_ERROR", function () {
    return 7;
});
_self.__defineGetter__("CALL_ERROR_OUTGOING_CALLS_BARRED", function () {
    return 8;
});
_self.__defineGetter__("CALL_ERROR_GENERAL", function () {
    return 9;
});
_self.__defineGetter__("CALL_ERROR_MAINTENANCE_REQUIRED", function () {
    return 10;
});
_self.__defineGetter__("CALL_ERROR_SERVICE_NOT_AVAILABLE", function () {
    return 11;
});
_self.__defineGetter__("CALL_ERROR_DUE_TO_FADING", function () {
    return 12;
});
_self.__defineGetter__("CALL_ERROR_LOST_DUE_TO_FADING", function () {
    return 13;
});
_self.__defineGetter__("CALL_ERROR_TRY_AGAIN", function () {
    return 14;
});
_self.__defineGetter__("CALL_ERROR_FDN_MISMATCH", function () {
    return 15;
});
_self.__defineGetter__("CALL_ERROR_CONNECTION_DENIED_BY_NETWORK", function () {
    return 16;
});
_self.__defineGetter__("CALL_ERROR_NUMBER_NOT_IN_SERVICE", function () {
    return 17;
});
_self.__defineGetter__("CALL_ERROR_PLEASE_TRY_LATER", function () {
    return 18;
});
_self.__defineGetter__("CALL_ERROR_SERVICE_CONFLICT", function () {
    return 19;
});
_self.__defineGetter__("CALL_ERROR_SYSTEM_BUSY_TRY_LATER", function () {
    return 20;
});
_self.__defineGetter__("CALL_ERROR_USER_BUSY_IN_PRIVATE", function () {
    return 21;
});
_self.__defineGetter__("CALL_ERROR_USER_BUSY_IN_DATA", function () {
    return 22;
});
_self.__defineGetter__("CALL_ERROR_USER_NOT_AUTHORIZED", function () {
    return 23;
});
_self.__defineGetter__("CALL_ERROR_USER_NOT_AVAILABLE", function () {
    return 24;
});
_self.__defineGetter__("CALL_ERROR_USER_UNKNOWN", function () {
    return 25;
});
_self.__defineGetter__("CALL_ERROR_USER_NOT_REACHABLE", function () {
    return 26;
});
_self.__defineGetter__("CALL_ERROR_INCOMING_CALL_BARRED", function () {
    return 27;
});
_self.__defineGetter__("CALL_ERROR_CALL_REPLACED_BY_STK", function () {
    return 28;
});
_self.__defineGetter__("CALL_ERROR_STK_CALL_NOT_ALLOWED", function () {
    return 29;
});

module.exports = _self;
