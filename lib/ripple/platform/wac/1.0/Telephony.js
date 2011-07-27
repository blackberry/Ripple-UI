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
var _self,
    exception = require('ripple/exception'),
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    constants = require('ripple/constants'),
    Device = require('ripple/platform/wac/1.0/Device'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception');


function _throwUnsupportedException(method) {
    exception.raise(ExceptionTypes.UNSUPPORTED, "Method not supported." + (method || ""), new Exception());
}

_self = {

    // Public Callbacks
    onCallEvent: undefined,// function (callType, phoneNumber) { },
    onCallRecordsFound: undefined,// function (callRecords) { };

    // Public Methods
    initiateVoiceCall: function (phoneNumber) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER, "initiateVoiceCall invalid number of parameters", new Exception());
        //HACK: should this be hardcoded?
        //I am still not even sure this is the correct behaviour
        Device.launchApplication("PHONECALL", phoneNumber);

        if (_self.onCallEvent) {
            //HACK: shouldn't be hardcoded
            //also what should the context be? isn't spec'ed
            _self.onCallEvent.apply(_self, ["outgoing", phoneNumber]);
        }
    },
    getCallRecordCnt: function (callRecordType) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER, "getCallRecordCnt invalid number of parameters", new Exception());
        var calls = db.retrieveObject(constants.TELEPHONY.CALL_LIST_KEY);

        return utils.sum(calls, function (call) {
            return call.callRecordType === callRecordType;
        });
    },
    getCallRecord: function (callRecordType, id) {
        utils.validateNumberOfArguments(2, 2, arguments.length, ExceptionTypes.INVALID_PARAMETER, "getCallRecord invalid number of parameters", new Exception());
        var calls = db.retrieveObject(constants.TELEPHONY.CALL_LIST_KEY);

        return utils.map(calls, function (call) {
            return call.callRecordType === callRecordType ? call : null;
        }).reduce(function (match, call) {
            return match || call.callRecordId === id || null;
        }, null);
    },
    deleteCallRecord: function (callRecordType, id) {
        utils.validateNumberOfArguments(2, 2, arguments.length, ExceptionTypes.INVALID_PARAMETER, "deleteCallRecord invalid number of parameters", new Exception());
        var calls = db.retrieveObject(constants.TELEPHONY.CALL_LIST_KEY),
            indexToDelete = calls.reduce(function (result, call, index) {
                return call.callRecordType === callRecordType &&
                       call.callRecordId === id ? index : result;
            }, -1);

        if (indexToDelete >= 0) {
            calls.splice(indexToDelete, 1);
            db.saveObject(constants.TELEPHONY.CALL_LIST_KEY, calls);
        }

    },

    deleteAllCallRecords: function (callRecordType) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER, "deleteAllCallRecords invalid number of parameters", new Exception());
        var calls = db.retrieveObject(constants.TELEPHONY.CALL_LIST_KEY),
            indexesToDelete = calls.reduce(function (result, call, index) {
                if (call.callRecordType === callRecordType) {
                    result.push(index);
                }
                return result;
            }, []);

        utils.forEach(indexesToDelete, function (index) {
            calls.splice(index, 1);
        });

        if (indexesToDelete.length > 0) {
            db.saveObject(constants.TELEPHONY.CALL_LIST_KEY, calls);
        }

    },

    findCallRecords: function (comparisonRecord, startInx, endInx) {
        utils.validateNumberOfArguments(1, 3, arguments.length, ExceptionTypes.INVALID_PARAMETER, "findCallRecords invalid number of parameters", new Exception());
        var calls = db.retrieveObject(constants.TELEPHONY.CALL_LIST_KEY);
        utils.find(comparisonRecord, calls, startInx, endInx, _self.onCallRecordsFound);

    }

};

module.exports = _self;
