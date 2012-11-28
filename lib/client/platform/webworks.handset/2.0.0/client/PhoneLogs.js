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
var transport = ripple('platform/webworks.core/2.0.0/client/transport'),
    CallLog = ripple('platform/webworks.handset/2.0.0/client/CallLog'),
    utils = ripple('utils'),
    _onCallLog = {
        Added: null,
        Removed: null,
        Updated: null,
        Reset: null,
    },
    _uri = "blackberry/phone/logs/",
    _self;

function _massage(property, name) {
    if (name === "date" && property) {
        return new Date(property);
    }
    return property;
}

function _toCallLog(log) {
    var callLog = new CallLog(),
        prop;
    for (prop in log) {
        if (log.hasOwnProperty(prop)) {
            callLog[prop] = _massage(log[prop], prop);
        }
    }
    return callLog;
}

function handle(evt) {
    return function (response) {
        var func = _onCallLog[evt], args;

        if (func) {
            args = utils.map(response, function (value) {
                return _toCallLog(value);
            });
            func.apply(null, args);
        }

        return !!func;
    };
}

function poll(path) {
    transport.poll(_uri + path, {}, handle(path.replace("onCallLog", "")));
}

_self = {
    addPhoneLogListener: function (onCallLogAdded, onCallLogRemoved, onCallLogUpdated, onCallLogReset) {
        _onCallLog.Added = onCallLogAdded;
        _onCallLog.Removed = onCallLogRemoved;
        _onCallLog.Updated = onCallLogUpdated;
        _onCallLog.Reset = onCallLogReset;

        if (onCallLogAdded) {
            poll("onCallLogAdded");
        }

        if (onCallLogRemoved) {
            poll("onCallLogRemoved");
        }

        if (onCallLogUpdated) {
            poll("onCallLogUpdated");
        }

        if (onCallLogReset) {
            poll("onCallLogReset");
        }

        return !!(onCallLogAdded || onCallLogRemoved ||
                  onCallLogUpdated || onCallLogRemoved);
    },

    callAt: function (index, folderID) {
        var log = transport.call(_uri + "callAt", {
            get: {
                index: index,
                folderID: folderID
            }
        });

        if (log && log.date) {
            log.date = new Date(log.date);
        }

        return log;
    },

    deleteCallAt: function (index, folderID) {
        return transport.call(_uri + "deleteCallAt", {
            get: {
                index: index,
                folderID: folderID
            }
        });
    },

    find: function (filter, folderID, orderBy, maxReturn, isAscending) {
        return transport.call(_uri + "find", {
            post: {
                filter: filter,
                folderID: folderID,
                orderBy: orderBy,
                maxReturn: maxReturn,
                isAscending: isAscending
            }
        }).map(_toCallLog);
    },

    numberOfCalls: function (folderID) {
        return transport.call(_uri + "numberOfCalls", {
            get: {
                folderID: folderID
            }
        });
    }
};

_self.__defineGetter__("FOLDER_MISSED_CALLS", function () {
    return 0;
});

_self.__defineGetter__("FOLDER_NORMAL_CALLS", function () {
    return 1;
});

module.exports = _self;
