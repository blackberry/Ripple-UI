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
function CallLog() {
    // readwrite  property  String   addressBookNumber
    // readwrite  property  String   addressBookType
    // readwrite  property  Date   date
    // readwrite  property  Number   duration
    // readwrite  property  String   name
    // readwrite  property  String   notes
    // readwrite  property  String   number
    // readwrite  property  Number   status
    // readwrite  property  Number   type
    this.addressBookNumber = null;
    this.addressBookType = null;
    this.date = null;
    this.duration = null;
    this.name = null;
    this.notes = null;
    this.number = null;
    this.status = null;
    this.type = null;
}

function _get(val) {
    return function () {
        return val;
    };
}

CallLog.__defineGetter__("STATUS_NORMAL", _get(0));
CallLog.__defineGetter__("STATUS_BUSY", _get(1));
CallLog.__defineGetter__("STATUS_CONGESTION", _get(2));
CallLog.__defineGetter__("STATUS_PATH_UNAVAILABLE", _get(3));
CallLog.__defineGetter__("STATUS_NUMBER_UNOBTAINABLE", _get(4));
CallLog.__defineGetter__("STATUS_AUTHENTICATION_FAILURE", _get(5));
CallLog.__defineGetter__("STATUS_EMERGENCY_CALLS_ONLY", _get(6));
CallLog.__defineGetter__("STATUS_HOLD_ERROR", _get(7));
CallLog.__defineGetter__("STATUS_OUTGOING_CALLS_BARRED", _get(8));
CallLog.__defineGetter__("STATUS_GENERAL_ERROR", _get(9));
CallLog.__defineGetter__("STATUS_MAINTENANCE_REQUIRED", _get(10));
CallLog.__defineGetter__("STATUS_SERVICE_NOT_AVAILABLE", _get(11));
CallLog.__defineGetter__("STATUS_CALL_FAIL_DUE_TO_FADING", _get(12));
CallLog.__defineGetter__("STATUS_CALL_LOST_DUE_TO_FADING", _get(13));
CallLog.__defineGetter__("STATUS_CALL_FAILED_TRY_AGAIN", _get(14));
CallLog.__defineGetter__("STATUS_FDN_MISMATCH", _get(15));
CallLog.__defineGetter__("STATUS_CONNECTION_DENIED", _get(16));
CallLog.__defineGetter__("STATUS_INCOMING_CALL_BARRED", _get(17));
CallLog.__defineGetter__("TYPE_RECEIVED_CALL", _get(0));
CallLog.__defineGetter__("TYPE_PLACED_CALL", _get(1));
CallLog.__defineGetter__("TYPE_MISSED_CALL_UNOPENED", _get(2));
CallLog.__defineGetter__("TYPE_MISSED_CALL_OPENED", _get(3));

module.exports = CallLog;
