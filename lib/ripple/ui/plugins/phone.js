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
var utils = require('ripple/utils'),
    Phone = require('ripple/platform/webworks.handset/2.0.0/client/Phone'),
    CallLog = require('ripple/platform/webworks.handset/2.0.0/client/CallLog'),
    event = require('ripple/event'),
    _console = require('ripple/console'),
    eventSelect = document.getElementById("phone-event-types"),
    eventErrorContainer = document.getElementById("phone-event-error-container"),
    eventErrorSelect = document.getElementById("phone-event-error-types");

function _firePhoneLogEvents(type, number, error) {
    if (type === Phone.CB_CALL_INITIATED ||
        type === Phone.CB_CALL_ANSWERED) {
        event.trigger("PhoneCallLogAdded", [{
            date: new Date(),
            number: number,
            status: CallLog.STATUS_NORMAL,
            type: CallLog.TYPE_RECEIVED_CALL
        }], true);
    } else if (type === Phone.CB_CALL_ENDED_BYUSER ||
                type === Phone.CB_CALL_FAILED) {
        event.trigger("PhoneCallLogAdded", [{
            date: new Date(),
            number: number,
            status: CallLog.STATUS_NORMAL,
            type: CallLog.TYPE_PLACED_CALL
        }], true);
    }
}

function _updateActiveCalls(type, number, error) {
    if (type === Phone.CB_CALL_INITIATED ||
        type === Phone.CB_CALL_CONNECTED ||
        type === Phone.CB_CALL_CONFERENCECALL_ESTABLISHED ||
        type === Phone.CB_CALL_DIRECTCONNECT_CONNECTED ||
        type === Phone.CB_CALL_ANSWERED) {
        event.trigger("PhoneCallInitiated", [{
            id: number,
            onhold: false,
            outgoing: false,
            recipient: {
                name: "",
                number: String(number)
            }
        }], true);
    } else if (type === Phone.CB_CALL_ENDED_BYUSER ||
                type === Phone.CB_CALL_FAILED ||
                type === Phone.CB_CALL_DISCONNECTED ||
                type === Phone.CB_CONFERENCECALL_DISCONNECTED ||
                type === Phone.CB_CALL_DIRECTCONNECT_DISCONNECTED) {
        event.trigger("PhoneCallEnded", [{
            id: number
        }], true);
    }
}

module.exports = {
    panel: {
        domId: "phone-container",
        collapsed: true,
        pane: "right"
    },
    initialize: function (prev, baton) {
        utils.forEach(Phone, function (value, prop) {
            if (prop.match(/^CB_/)) {
                eventSelect.appendChild(utils.createElement("option", {
                    value: value,
                    innerHTML: prop.replace(/^CB_(CALL_)?/, "")
                }));
            }

            if (prop.match(/^CALL_ERROR_/)) {
                eventErrorSelect.appendChild(utils.createElement("option", {
                    value: value,
                    innerHTML: prop.replace(/^CALL_ERROR_/, "")
                }));
            }
        });

        document.getElementById("phone-event-types").addEventListener("change", function () {
            eventErrorContainer.setAttribute("style", parseInt(eventSelect.value, 10) === Phone.CB_CALL_FAILED ? "" : "display: none");
        });

        document.getElementById("phone-logs-clear").addEventListener("click", function () {
            event.trigger("PhoneCallLogReset");
        });

        document.getElementById("phone-event-send").addEventListener("click", function () {
            var type = parseInt(eventSelect.value, 10),
                error = type === Phone.CB_CALL_FAILED ? eventErrorSelect.value : undefined,
                callId = document.getElementById("phone-call-id").value;

            _firePhoneLogEvents(type, callId, error);
            _updateActiveCalls(type, callId, error);

            event.trigger("PhoneEvent", [type, callId, error]);

            _console.log("Fired PhoneEvent (type " + type +  ") CallID: " +
                         callId + (error ? (" (error type " + error + ")") : ""));
        }, false);
    }
};
