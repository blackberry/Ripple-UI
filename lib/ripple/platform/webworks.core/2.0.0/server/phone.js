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
var PhoneCall = require('ripple/platform/webworks.core/2.0.0/client/PhoneCall'),
    PhoneLogs = require('ripple/platform/webworks.core/2.0.0/client/PhoneLogs'),
    CallLog = require('ripple/platform/webworks.core/2.0.0/client/CallLog'),
    select = require('ripple/platform/webworks.core/2.0.0/select'),
    event = require('ripple/event'),
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    _KEY = "blackberry-phone-logs",
    _onPhoneEventListeners = {},
    _activeCalls = {},
    _onCallLogAdded,
    _onCallLogRemoved,
    _onCallLogUpdated,
    _onCallLogReset,
    _self;

function _defaultLogs() {
    var n1 = new CallLog(),
        n2 = new CallLog(),
        m1 = new CallLog(),
        m2 = new CallLog();

    n1.number = "12344567";
    n1.name = "larry";
    n1.type = CallLog.TYPE_PLACED_CALL;
    n1.status = CallLog.STATUS_NORMAL;

    n2.number = "14567890";
    n2.name = "curly";
    n2.type = CallLog.TYPE_RECEIVED_CALL;
    n2.status = CallLog.STATUS_NORMAL;

    m1.number = "17659800";
    m1.name = "moe";
    m1.type = CallLog.TYPE_MISSED_CALL_UNOPENED;
    m1.status = CallLog.STATUS_NORMAL;

    m2.number = "14567896";
    m2.name = "snarf";
    m2.type = CallLog.TYPE_MISSED_CALL_OPENED;
    m2.status = CallLog.STATUS_NORMAL;

    return {
        normal: [n1, n2],
        missed: [m1, m2]
    };
}

function _getLogs(folderID) {
    var logs = db.retrieveObject(_KEY) || _defaultLogs();
    return folderID === undefined || folderID === null ?
        logs : logs[folderID !== PhoneLogs.FOLDER_MISSED_CALLS ? "normal" : "missed"];
}

function _saveLogs(logs) {
    db.saveObject(_KEY, logs);
}

function _isMissedCall(log) {
    return (log.type === CallLog.TYPE_MISSED_CALL_UNOPENED ||
            log.type === CallLog.TYPE_MISSED_CALL_OPENED) ? true : false;
}

function _isNormalCall(log) {
    return (log.type === CallLog.TYPE_RECEIVED_CALL ||
            log.type === CallLog.TYPE_PLACED_CALL) ? true : false;
}

event.on("PhoneEvent", function (type, callId, error) {
    var baton = _onPhoneEventListeners[type];
    delete _onPhoneEventListeners[type];

    return baton && baton.pass({id: 1, data: {callId: callId, error: error}});
});

event.on("PhoneCallLogAdded", function (log) {
    var logs = _getLogs(),
        baton = _onCallLogAdded;

    logs[_isMissedCall(log) ? "missed" : "normal"].push(log);
    _saveLogs(logs);

    _onCallLogAdded = null;
    return baton && baton.pass({id: 1, data: log});
});

event.on("PhoneCallLogRemoved", function (log) {
    // TODO: make this be the only one responsible for deletion (instead of triggering internally)
    var baton = _onCallLogRemoved;
    _onCallLogRemoved = null;
    return baton && baton.pass({id: 1, data: log});
});

event.on("PhoneCallLogUpdated", function (newLog, oldLog) {
    // TODO: implement way to update with just this event
    var baton = _onCallLogUpdated;
    _onCallLogUpdated = null;
    return baton && baton.pass({id: 1, data: {
        newLog: newLog,
        oldLog: oldLog
    }});
});

event.on("PhoneCallLogReset", function () {
    _saveLogs(_defaultLogs());
    var baton = _onCallLogReset;
    _onCallLogReset = null;
    return baton && baton.pass({id: 1});
});

event.on("PhoneCallInitiated", function (call) {
    _activeCalls[call.id] = call;
});

event.on("PhoneCallEnded", function (call) {
    delete _activeCalls[call.id];
});

_self = {
    logs: {
        onCallLogAdded: function (get, post, baton) {
            baton.take();
            _onCallLogAdded = baton;
        },

        onCallLogRemoved: function (get, post, baton) {
            baton.take();
            _onCallLogRemoved = baton;
        },

        onCallLogUpdated: function (get, post, baton) {
            baton.take();
            _onCallLogUpdated = baton;
        },

        onCallLogReset: function (get, post, baton) {
            baton.take();
            _onCallLogReset = baton;
        },

        callAt: function (get) {
            var logs = _getLogs(get.folderID);
            return {code: 1, data: logs.length > get.index ? logs[get.index] : null};
        },

        deleteCallAt: function (get) {
            var logs = _getLogs(),
                subLog = _getLogs(get.folderID),
                deleted = false,
                log;

            if (subLog.length > get.index && (log = subLog.splice(get.index, 1))) {
                event.trigger("PhoneCallLogRemoved", [log]);
                _saveLogs(logs);
                deleted = true;
            }

            return {code: 1, data: deleted};
        },

        find: function (get, post) {
            var data = select.from(_getLogs(post.folderID !== null && post.folderID !== undefined ?
                                        post.folderID : PhoneLogs.FOLDER_NORMAL_CALLS))
                    .orderBy(post.orderBy, post.isAscending === false ? "desc" : "asc")
                    .max(post.maxReturn)
                    .where(post.filter, select.ops.phone);
            return {code: 1, data: data};
        },

        numberOfCalls: function (get) {
            return {code: 1, data: _getLogs(get.folderID).length};
        }
    },

    onPhoneEvent: function (get, post, baton) {
        baton.take();
        _onPhoneEventListeners[get.eventType] = baton;
    },

    activeCalls: function () {
        var data = utils.map(_activeCalls, function (callItem) {
            var call = new PhoneCall(callItem.onhold);
            call.outgoing = callItem.outgoing;
            call.recipientName = callItem.recipient.name;
            call.recipientNumber = callItem.recipient.number;
            return call;
        });
        return {code: 1, data: data};
    },

    inActiveCall: function () {
        return {code: 1, data: utils.count(_activeCalls) > 0 ? true : false};
    }
};

module.exports = _self;
