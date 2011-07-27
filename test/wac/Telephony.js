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
describe("wac_Telephony", function () {

    var telephony = require('ripple/platform/wac/1.0/Telephony'),
        CallRecord = require('ripple/platform/wac/1.0/CallRecord'),
        callType = require('ripple/platform/wac/1.0/CallRecordTypes'),
        device = require('ripple/platform/wac/1.0/Device'),
        db = require('ripple/db'),
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("should initiate a voice call", function () {
        s.mock(device)
            .expects("launchApplication")
            .withExactArgs("PHONECALL", "5199541707")
            .once();

        telephony.initiateVoiceCall("5199541707");
    });

    it("call record is an instance of call record", function () {
        expect(new CallRecord() instanceof CallRecord).toBeTruthy();
    });

    it("should fire the onCallEvent when initiating a voice call", function () {
        s.stub(device, "launchApplication");

        telephony.onCallEvent = s.mock().withExactArgs(callType.OUTGOING, "5199541707").once();
        telephony.initiateVoiceCall("5199541707");
    });

    it("should get the count of call records", function () {
        s.stub(db, "retrieveObject")
            .returns([{callRecordType: callType.MISSED},
                      {callRecordType: callType.MISSED}]);

        expect(2).toEqual(telephony.getCallRecordCnt(callType.MISSED));
    });

    it("should only count the call records of the requested type", function () {
        s.mock(db)
            .expects("retrieveObject")
            .once()
            .returns([{callRecordType: callType.MISSED},
                      {callRecordType: callType.OUTGOING}]);

        expect(1).toEqual(telephony.getCallRecordCnt(callType.MISSED));
    });

    it("should return a count of 0 call records if the type is unknown", function () {
        s.mock(db)
            .expects("retrieveObject")
            .once()
            .returns([{callRecordType: callType.MISSED},
                      {callRecordType: callType.MISSED}]);

        expect(0).toEqual(telephony.getCallRecordCnt("foo"));
    });

    it("should return the callRecord with the given id", function () {
        s.stub(db, "retrieveObject")
            .returns([{callRecordType: callType.MISSED, callRecordId: "1"},
                      {callRecordType: callType.MISSED, callRecordId: "2"}]);

        var call = telephony.getCallRecord(callType.MISSED, "1");

        expect(call).not.toBeNull();
    });

    it("should return null when attempt to get callRecord by not in found", function () {
        s.stub(db, "retrieveObject").returns([]);
        var call = telephony.getCallRecord(callType.MISSED, "1");
        expect(call).toBeNull();
    });

    it("should delete a call record by id", function () {
        var calls = [
            {callRecordType: callType.MISSED, callRecordId: "1"},
            {callRecordType: callType.MISSED, callRecordId: "2"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        s.mock(db).expects("saveObject").once();

        telephony.deleteCallRecord(callType.MISSED, "1");

        expect(1).toEqual(calls.length);
    });

    it("shouldn't delete a record if no matches", function () {
        var calls = [
            {callRecordType: callType.MISSED, callRecordId: "1"},
            {callRecordType: callType.MISSED, callRecordId: "2"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        s.mock(db).expects("saveObject").never();

        telephony.deleteCallRecord(callType.OUTGOING, "1");

        expect(2).toEqual(calls.length);
    });

    it("should delete all calls of the given type", function () {
        var calls = [
            {callRecordType: callType.OUTGOING, callRecordId: "1"},
            {callRecordType: callType.OUTGOING, callRecordId: "2"},
            {callRecordType: callType.MISSED, callRecordId: "1"},
            {callRecordType: callType.MISSED, callRecordId: "2"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        s.mock(db).expects("saveObject").once();

        telephony.deleteAllCallRecords(callType.OUTGOING);

        expect(2).toEqual(calls.length);
    });

    it("should raise the onCallRecordsFound when searching", function () {

        s.stub(db, "retrieveObject").returns([]);

        telephony.onCallRecordsFound = s.mock().withExactArgs([]).once();
        telephony.findCallRecords({callRecordType: callType.MISSED});
    });

    it("can search for records by type", function () {

        var calls = [
            {callRecordType: callType.OUTGOING, callRecordId: "1"},
            {callRecordType: callType.OUTGOING, callRecordId: "2"},
            {callRecordType: callType.MISSED, callRecordId: "1"},
            {callRecordType: callType.MISSED, callRecordId: "2"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[2], calls[3]]).once();
        telephony.findCallRecords({callRecordType: callType.MISSED});
    });

    it("can search for records by id", function () {

        var calls = [
            {callRecordType: callType.OUTGOING, callRecordId: "1"},
            {callRecordType: callType.OUTGOING, callRecordId: "2"},
            {callRecordType: callType.MISSED, callRecordId: "1"},
            {callRecordType: callType.MISSED, callRecordId: "2"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[0], calls[2]]).once();
        telephony.findCallRecords({callRecordId: "1"});
    });

    it("can search for records by name", function () {
        var calls = [
            {callRecordName: "Gwen"},
            {callRecordName: "Steph"},
            {callRecordName: "Griffin"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[0]]).once();
        telephony.findCallRecords({callRecordName: "Gwen"});
    });

    it("can search for records with a blank name", function () {
        var calls = [
            {callRecordName: "Gwen"},
            {callRecordName: "Steph"},
            {callRecordName: "", callRecordAddress: "5551234"},
            {callRecordName: "Griffin"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[2]]).once();
        telephony.findCallRecords({callRecordName: ""});
    });

    it("can search for records by address", function () {
        var calls = [
            {callRecordAddress: "5552222"},
            {callRecordAddress: "5551111"},
            {callRecordAddress: "5551234"},
            {callRecordAddress: "5551111"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[1], calls[3]]).once();
        telephony.findCallRecords({callRecordAddress: "5551111"});
    });

    it("can search for records with a blank address", function () {
        var calls = [
            {callRecordAddress: "5552222"},
            {callRecordAddress: "5551111"},
            {callRecordAddress: ""},
            {callRecordAddress: "5551111"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[2]]).once();
        telephony.findCallRecords({callRecordAddress: ""});
    });

    it("can search for records by duration", function () {
        var calls = [
            {durationSeconds: 60},
            {durationSeconds: 120},
            {durationSeconds: 60}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[1]]).once();
        telephony.findCallRecords({durationSeconds: 120});
    });

    it("can search for records by start time", function () {
        var calls = [
            {startTime: new Date(new Date() - 100)},
            {startTime: new Date(new Date() - 200)},
            {startTime: new Date(new Date() - 300)}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[2]]).once();
        telephony.findCallRecords({startTime: calls[2].startTime});
    });

    it("can search by multiple values", function () {
        var calls = [
            {callRecordName: "Gwen", callRecordAddress: "5551111"},
            {callRecordName: "Gwen", callRecordAddress: "5552222"},
            {callRecordName: "Gwen", callRecordAddress: "5552222"},
            {callRecordName: "Steph", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[1], calls[2]]).once();
        telephony.findCallRecords({callRecordName: "Gwen", callRecordAddress: "5552222"});
    });

    it("searching is case insensitive", function () {
        var calls = [
            {callRecordName: "Gord", callRecordAddress: "5551111"},
            {callRecordName: "GORD", callRecordAddress: "5552222"},
            {callRecordName: "GoRd", callRecordAddress: "5552222"},
            {callRecordName: "gOrD", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs(calls).once();
        telephony.findCallRecords({callRecordName: "gord"});
    });

    it("can use wildcards when searching name", function () {
        var calls = [
            {callRecordName: "Steph", callRecordAddress: "5551111"},
            {callRecordName: "Gwen", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gord", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[1], calls[2], calls[3]]).once();
        telephony.findCallRecords({callRecordName: "G*"});

    });

    it("can use wildcards when searching for address", function () {
        var calls = [
            {callRecordName: "Steph", callRecordAddress: "5551111"},
            {callRecordName: "Gwen", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gord", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[1], calls[2], calls[3]]).once();
        telephony.findCallRecords({callRecordAddress: "*22*"});
    });

    it("can escape * when searching", function () {
        var calls = [
            {callRecordName: "Steph", callRecordAddress: "5551111"},
            {callRecordName: "Gwen", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gord", callRecordAddress: "*69"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[3]]).once();
        telephony.findCallRecords({callRecordAddress: "\\*69"});
    });


    it("can search with multiple wildcards", function () {
        var calls = [
            {callRecordName: "Steph", callRecordAddress: "5551111"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[1]]).once();
        telephony.findCallRecords({callRecordAddress: "*12*"});
    });

    it("can search for strings containing escaped single quotes", function () {
        var calls = [
            {callRecordName: "George O'Conner"},
            {callRecordName: "Larry"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[0]]).once();
        telephony.findCallRecords({callRecordName: "*O\'Conner"});
    });

    it("can search for strings containing escaped double quotes", function () {
        var calls = [
            {callRecordName: 'George O"Conner'},
            {callRecordName: "Larry"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[0]]).once();
        telephony.findCallRecords({callRecordName: "*O\"Conner"});
    });

    it("can search for only the first 2 records", function () {
        var calls = [
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[0], calls[1]]).once();
        telephony.findCallRecords({callRecordName: "g*"}, 0, 2);
    });

    it("can serach for the third and forth records", function () {
        var calls = [
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[2], calls[3]]).once();
        telephony.findCallRecords({callRecordName: "g*"}, 2, 4);
    });

    it("if startInx equals, only one item whose sequence number is startInx is returned", function () {
        var calls = [
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[2]]).once();
        telephony.findCallRecords({callRecordName: "g*"}, 2, 2);
    });

    it("if startInx is greater than endInx the returned callRecordsFound will be an empty array.", function () {
        var calls = [
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([]).once();
        telephony.findCallRecords({callRecordName: "g*"}, 4, 2);
    });


    it("if startInx is greater than the number of found item the returned callRecordsFound will be an empty array.", function () {
        var calls = [
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gord", callRecordAddress: "5551234"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([]).once();
        telephony.findCallRecords({callRecordName: "Gord"}, 3, 6);
    });

    it("if endInx is greater than the number of found items the returned callRecordsFound will contain items between startInx and the last returned item", function () {
        var calls = [
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Gord", callRecordAddress: "5551234"},
            {callRecordName: "Gwen", callRecordAddress: "5551234"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"},
            {callRecordName: "Griffin", callRecordAddress: "5552222"}
        ];

        s.stub(db, "retrieveObject").returns(calls);
        telephony.onCallRecordsFound = s.mock().withExactArgs([calls[0], calls[3]]).once();
        telephony.findCallRecords({callRecordName: "Gwen"}, 0, 6);
    });
});
