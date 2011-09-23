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
describe("webworks phone", function () {
    var phone = require('ripple/platform/webworks.handset/2.0.0/server/phone'),
        Phone = require('ripple/platform/webworks.handset/2.0.0/client/Phone'),
        PhoneCall = require('ripple/platform/webworks.handset/2.0.0/client/PhoneCall'),
        CallLog = require('ripple/platform/webworks.handset/2.0.0/client/CallLog'),
        PhoneLogs = require('ripple/platform/webworks.handset/2.0.0/client/PhoneLogs'),
        FilterExpression = require('ripple/platform/webworks.handset/2.0.0/client/FilterExpression'),
        webworks = require('ripple/platform/webworks.handset/2.0.0/server'),
        spec = require('ripple/platform/webworks.handset/2.0.0/spec'),
        select = require('ripple/platform/webworks.core/2.0.0/select'),
        event = require('ripple/event'),
        MockBaton = function () {
            this.take = jasmine.createSpy("baton.take");
            this.pass = jasmine.createSpy("baton.pass");
        },
        db = require('ripple/db'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport');

    describe("server index", function () {
        it("exposes phone", function () {
            expect(webworks.blackberry.phone).toBe(phone);
        });
    });

    describe("spec index", function () {
        it("includes phone according to proper api structure", function () {
            expect(spec.objects.blackberry.children.phone.path).toBeFalsy();
        });

        it("includes Phone according to proper api structure", function () {
            expect(spec.objects.blackberry.children.phone.children.Phone.path)
                .toEqual("webworks.handset/2.0.0/client/Phone");
        });

        it("includes PhoneLogs according to proper api structure", function () {
            expect(spec.objects.blackberry.children.phone.children.PhoneLogs.path)
                .toEqual("webworks.handset/2.0.0/client/PhoneLogs");
        });

        it("includes CallLog according to proper api structure", function () {
            expect(spec.objects.blackberry.children.phone.children.PhoneLogs.children.CallLog.path)
                .toEqual("webworks.handset/2.0.0/client/CallLog");
        });

        it("includes PhoneFilterExpression according to proper api structure", function () {
            expect(spec.objects.blackberry.children.phone.children.Find.children.FilterExpression.path)
                .toEqual("webworks.handset/2.0.0/client/FilterExpression");
        });
    });

    describe("client", function () {
        describe("PhoneLogs", function () {
            describe("addPhoneLogListener", function () {
                var callback = function () {};

                beforeEach(function () {
                    spyOn(transport, "poll");
                });

                it("calls the transport with proper args when there are callbacks", function () {
                    PhoneLogs.addPhoneLogListener(callback, callback, callback, callback);
                    expect(transport.poll.callCount).toBe(4);
                });

                it("does not register the event handler if a callback is null", function () {
                    PhoneLogs.addPhoneLogListener(callback, null, callback, null);
                    expect(transport.poll.callCount).toBe(2);
                });

                it("maps the response into CallLog objects", function () {
                    var data = {log: {status: 5}, log2: {status: 3}};

                    callback = jasmine.createSpy();
                    transport.poll.andCallFake(function (url, opts, callback) {
                        callback(data);
                    });

                    PhoneLogs.addPhoneLogListener(callback, null, null, null);

                    expect(callback.argsForCall[0][0] instanceof CallLog).toBe(true);
                    expect(callback.argsForCall[0][0].status).toBe(data.log.status);
                    expect(callback.argsForCall[0][1] instanceof CallLog).toBe(true);
                    expect(callback.argsForCall[0][1].status).toBe(data.log2.status);
                });

                it("returns true when adding some listeners", function () {
                    expect(PhoneLogs.addPhoneLogListener(callback, null, null, callback)).toBe(true);
                });

                it("returns false when adding no listeners", function () {
                    expect(PhoneLogs.addPhoneLogListener()).toBe(false);
                });
            });

            describe("callAt", function () {
                it("calls the transport with proper args", function () {
                    var opts = {
                            get: {
                                index: 1,
                                folderID: "ID"
                            }
                        },
                        log = new CallLog();

                    log.date = new Date();

                    spyOn(transport, "call").andReturn(JSON.parse(JSON.stringify(log)));

                    expect(PhoneLogs.callAt(opts.get.index, opts.get.folderID)).toEqual(log);
                    expect(transport.call).toHaveBeenCalledWith("blackberry/phone/logs/callAt", opts);
                });
            });

            describe("deleteCallAt", function () {
                it("calls the transport with proper args", function () {
                    var get = {
                            index: 4,
                            folderID: "ID"
                        };

                    spyOn(transport, "call").andReturn("boolean");

                    expect(PhoneLogs.deleteCallAt(get.index, get.folderID)).toEqual("boolean");
                    expect(transport.call).toHaveBeenCalledWith("blackberry/phone/logs/deleteCallAt", {get: get});
                });
            });

            describe("find", function () {
                it("calls the transport with proper args", function () {
                    var logs = [];
                    spyOn(transport, "call").andReturn(logs);
                    expect(PhoneLogs.find(1, 2, 3, 4, 5)).toEqual(logs);
                    expect(transport.call).toHaveBeenCalledWith("blackberry/phone/logs/find", {
                        post: {
                            filter: 1,
                            folderID: 2,
                            orderBy: 3,
                            maxReturn: 4,
                            isAscending: 5
                        }
                    });
                });

                it("returns an array of massaged CallLog objects", function () {
                    var log = new CallLog(),
                        logs;

                    log.date = new Date();
                    log.name = "test";

                    spyOn(transport, "call").andReturn([JSON.parse(JSON.stringify(log))]);

                    logs = PhoneLogs.find();

                    expect(logs.length).toEqual(1);
                    expect(logs[0].date).toEqual(log.date);
                    expect(logs[0].name).toEqual(log.name);
                });
            });

            describe("numberOfCalls", function () {
                it("calls the transport with proper args", function () {
                    var opts = {
                        get: {
                            folderID: "ID"
                        }
                    };

                    spyOn(transport, "call").andReturn(3);

                    expect(PhoneLogs.numberOfCalls(opts.get.folderID)).toEqual(3);
                    expect(transport.call).toHaveBeenCalledWith("blackberry/phone/logs/numberOfCalls", opts);
                });
            });
        });

        describe("Phone", function () {
            describe("addPhoneListener", function () {
                it("polls the transport", function () {
                    spyOn(transport, "poll");
                    expect(Phone.addPhoneListener(function () {}, 0)).toBe(true); // sticks around..
                    expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/phone/onPhoneEvent");
                    expect(transport.poll.argsForCall[0][1]).toEqual({
                        get: {eventType: 0}
                    });
                });
            });

            describe("activeCalls", function () {
                it("calls the transport", function () {
                    var response = "array of active calls";
                    spyOn(transport, "call").andReturn(response);
                    expect(Phone.activeCalls()).toEqual(response);
                    expect(transport.call).toHaveBeenCalledWith("blackberry/phone/activeCalls");
                });
            });

            describe("inActiveCall", function () {
                it("calls the transport", function () {
                    var response = "boolean";
                    spyOn(transport, "call").andReturn(response);
                    expect(Phone.inActiveCall()).toEqual("boolean");
                    expect(transport.call).toHaveBeenCalledWith("blackberry/phone/inActiveCall");
                });
            });
        });
    });

    describe("server", function () {
        describe("logs", function () {
            describe("phone log events", function () {
                beforeEach(function () {
                    spyOn(db, "retrieveObject");
                    spyOn(db, "saveObject");
                });

                describe("onCallAdded", function () {
                    it("takes the baton", function () {
                        var baton = new MockBaton();
                        phone.logs.onCallLogAdded(null, null, baton);
                        expect(baton.take).toHaveBeenCalled();
                    });

                    it("passes the baton when PhoneCallLogAdded raised", function () {
                        var baton = new MockBaton(),
                            log = new CallLog();
                        phone.logs.onCallLogAdded(null, null, baton);
                        event.trigger("PhoneCallLogAdded", [log], true);
                        expect(baton.pass).toHaveBeenCalledWith({
                            code: 1,
                            data: {log: log}
                        });
                    });
                });

                describe("onCallLogRemoved", function () {
                    it("takes the baton", function () {
                        var baton = new MockBaton();
                        phone.logs.onCallLogRemoved(null, null, baton);
                        expect(baton.take).toHaveBeenCalled();
                    });

                    it("passes the baton when PhoneCallLogRemoved raised", function () {
                        var baton = new MockBaton(),
                            log = new CallLog();
                        phone.logs.onCallLogRemoved(null, null, baton);
                        event.trigger("PhoneCallLogRemoved", [log], true);
                        expect(baton.pass).toHaveBeenCalledWith({
                            code: 1,
                            data: {log: log}
                        });
                    });
                });

                describe("onCallLogRemoved", function () {
                    it("takes the baton", function () {
                        var baton = new MockBaton();
                        phone.logs.onCallLogRemoved(null, null, baton);
                        expect(baton.take).toHaveBeenCalled();
                    });

                    it("passes the baton when PhoneCallLogRemoved raised", function () {
                        var baton = new MockBaton(),
                            log = new CallLog();
                        phone.logs.onCallLogRemoved(null, null, baton);
                        event.trigger("PhoneCallLogRemoved", [log], true);
                        expect(baton.pass).toHaveBeenCalled();
                        expect(baton.pass).toHaveBeenCalledWith({
                            code: 1,
                            data: {log: log}
                        });
                    });
                });

                describe("onCallLogUpdated", function () {
                    it("takes the baton", function () {
                        var baton = new MockBaton();
                        phone.logs.onCallLogUpdated(null, null, baton);
                        expect(baton.take).toHaveBeenCalled();
                    });

                    it("passes the baton when PhoneCallLogUpdated raised", function () {
                        var baton = new MockBaton(),
                            log = new CallLog(),
                            log2 = new CallLog();
                        phone.logs.onCallLogUpdated(null, null, baton);
                        event.trigger("PhoneCallLogUpdated", [log, log2], true);
                        expect(baton.pass).toHaveBeenCalled();
                        expect(baton.pass).toHaveBeenCalledWith({
                            code: 1,
                            data: {
                                newLog: log,
                                oldLog: log2
                            }
                        });
                    });
                });

                describe("onCallLogReset", function () {
                    it("takes the baton", function () {
                        var baton = new MockBaton();
                        phone.logs.onCallLogReset(null, null, baton);
                        expect(baton.take).toHaveBeenCalled();
                    });

                    it("passes the baton when PhoneCallLogUpdated raised", function () {
                        var baton = new MockBaton();
                        phone.logs.onCallLogReset(null, null, baton);
                        event.trigger("PhoneCallLogReset", [], true);
                        expect(baton.pass).toHaveBeenCalled();
                    });
                });
            });

            describe("callAt", function () {
                it("retrieves a normal call log", function () {
                    var log = new CallLog(),
                        log2 = new CallLog();

                    log.type = CallLog.TYPE_RECEIVED_CALL;
                    log2.type = CallLog.TYPE_PLACED_CALL;

                    spyOn(db, "retrieveObject").andReturn({
                        normal: [log, log2],
                        missed: []
                    });

                    expect(phone.logs.callAt({
                        index: 0,
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    }).data).toEqual(log);

                    expect(phone.logs.callAt({
                        index: 1,
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    }).data).toEqual(log2);
                });

                it("retrieves a missed call log", function () {
                    var log = new CallLog(),
                        log2 = new CallLog();

                    log.type = CallLog.TYPE_MISSED_CALL_OPENED;
                    log2.type = CallLog.TYPE_PLACED_CALL;

                    spyOn(db, "retrieveObject").andReturn({
                        normal: [log2],
                        missed: [log]
                    });

                    expect(phone.logs.callAt({
                        index: 0,
                        folderID: PhoneLogs.FOLDER_MISSED_CALLS
                    }).data).toEqual(log);

                    expect(phone.logs.callAt({
                        index: 1,
                        folderID: PhoneLogs.FOLDER_MISSED_CALLS
                    }).data).toEqual(null);
                });

                it("returns null when normal logs are empty", function () {
                    var log = new CallLog();
                    log.type = CallLog.TYPE_PLACED_CALL;

                    spyOn(db, "retrieveObject").andReturn({
                        normal: [log],
                        missed: []
                    });

                    expect(phone.logs.callAt({
                        index: 0,
                        folderID: PhoneLogs.FOLDER_MISSED_CALLS
                    }).data).toEqual(null);
                });

                it("returns null when out of range", function () {
                    var log = new CallLog();
                    log.type = CallLog.TYPE_MISSED_CALL_OPENED;

                    spyOn(db, "retrieveObject").andReturn({
                        normal: [],
                        missed: [log]
                    });

                    expect(phone.logs.callAt({
                        index: 1,
                        folderID: PhoneLogs.FOLDER_MISSED_CALLS
                    }).data).toEqual(null);
                });
            });

            describe("deleteCallAt", function () {
                it("splices a call log from the array", function () {
                    var log = new CallLog(),
                        log2 = new CallLog(),
                        logs = {
                            normal: [log, log2],
                            missed: []
                        };

                    log.type = CallLog.TYPE_RECEIVED_CALL;
                    log2.type = CallLog.TYPE_PLACED_CALL;

                    spyOn(event, "trigger");
                    spyOn(db, "saveObject");
                    spyOn(db, "retrieveObject").andReturn(logs);

                    expect(phone.logs.deleteCallAt({
                        index: 0,
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    }).data).toEqual(true);

                    expect(event.trigger).toHaveBeenCalledWith("PhoneCallLogRemoved", [[log]]);
                    expect(db.saveObject).toHaveBeenCalledWith("blackberry-phone-logs", {
                        normal: [log2],
                        missed: []
                    });
                });
            });

            describe("find", function () {
                var from;

                beforeEach(function () {
                    from = {
                        where: jasmine.createSpy()
                    };

                    from.max = jasmine.createSpy().andReturn(from);
                    from.orderBy = jasmine.createSpy().andReturn(from);
                });

                it("calls select module with filter expression on specified folder", function () {
                    var filter = new FilterExpression(),
                        logs = {
                            normal: [new CallLog()],
                            missed: []
                        };

                    from.where = jasmine.createSpy().andReturn(logs);

                    spyOn(select, "from").andReturn(from);
                    spyOn(db, "retrieveObject").andReturn(logs);

                    phone.logs.find({}, {
                        filter: filter,
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    });

                    expect(from.where).toHaveBeenCalledWith(filter, select.ops.phone);
                    expect(select.from).toHaveBeenCalledWith(logs.normal);
                });

                it("defaults to normal call log list when not folder id is given", function () {
                    var log = new CallLog();

                    from.where = jasmine.createSpy().andReturn([log]);

                    spyOn(db, "retrieveObject").andReturn({
                        normal: [log],
                        missed: []
                    });
                    spyOn(select, "from").andReturn(from);

                    expect(phone.logs.find({}, {}).data).toEqual([log]);
                });

                it("returns unfiltered list of call logs", function () {
                    var log = new CallLog();

                    from.where = jasmine.createSpy().andReturn([log]);

                    spyOn(select, "from").andReturn(from);
                    spyOn(db, "retrieveObject");

                    expect(phone.logs.find({}, {}).data).toEqual([log]);
                });

                it("passes maxReturn", function () {
                    spyOn(select, "from").andReturn(from);
                    spyOn(db, "retrieveObject");

                    phone.logs.find({}, {
                        filter: new FilterExpression(),
                        maxReturn: 3,
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    });

                    expect(from.max).toHaveBeenCalledWith(3);
                });

                it("passes orderBy", function () {
                    spyOn(select, "from").andReturn(from);
                    spyOn(db, "retrieveObject");

                    phone.logs.find({}, {
                        filter: new FilterExpression(),
                        orderBy: "orderByProp",
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    });

                    expect(from.orderBy).toHaveBeenCalledWith("orderByProp", "asc");
                });

                it("passes desc when not isAscending", function () {
                    spyOn(select, "from").andReturn(from);
                    spyOn(db, "retrieveObject");

                    phone.logs.find({}, {
                        filter: new FilterExpression(),
                        orderBy: "foo",
                        isAscending: false,
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    });

                    expect(from.orderBy.mostRecentCall.args[1]).toEqual("desc");
                });

                it("passes asc when isAscending", function () {
                    spyOn(select, "from").andReturn(from);
                    spyOn(db, "retrieveObject");

                    phone.logs.find({}, {
                        filter: new FilterExpression(),
                        orderBy: "foo",
                        isAscending: true,
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    });

                    expect(from.orderBy.mostRecentCall.args[1]).toEqual("asc");
                });
            });

            describe("numberOfCalls", function () {
                it("returns the number of normal calls", function () {
                    var log = new CallLog(),
                        log2 = new CallLog();

                    log.type = CallLog.TYPE_RECEIVED_CALL;
                    log2.type = CallLog.TYPE_PLACED_CALL;

                    spyOn(db, "retrieveObject").andReturn({
                        normal: [log, log2],
                        missed: []
                    });

                    expect(phone.logs.numberOfCalls({
                        folderID: PhoneLogs.FOLDER_NORMAL_CALLS
                    }).data).toEqual(2);
                });

                it("returns the number of missed calls", function () {
                    var log = new CallLog(),
                        log2 = new CallLog();

                    log.type = CallLog.TYPE_MISSED_CALL_UNOPENED;
                    log2.type = CallLog.TYPE_MISSED_CALL_OPENED;

                    spyOn(db, "retrieveObject").andReturn({
                        normal: [],
                        missed: [log, log2]
                    });

                    expect(phone.logs.numberOfCalls({
                        folderID: PhoneLogs.FOLDER_MISSED_CALLS
                    }).data).toEqual(2);
                });
            });
        });

        describe("listener", function () {
            it("takes the baton", function () {
                var baton = new MockBaton();
                phone.onPhoneEvent({eventType: 123}, null, baton);
                expect(baton.take).toHaveBeenCalled();
            });

            it("passes the baton when PhoneEvent is raised", function () {
                var baton = new MockBaton(),
                    result;

                phone.onPhoneEvent({eventType: 123}, null, baton);

                event.trigger("PhoneEvent", [123, 456, 789], true);

                expect(baton.pass).toHaveBeenCalled();
                result = baton.pass.mostRecentCall.args[0];
                expect(result.code).toBe(1);
                expect(result.data.callId).toBe(456);
                expect(result.data.error).toBe(789);
            });

            it("only passes the baton once", function () {
                var baton = new MockBaton();
                phone.onPhoneEvent({eventType: 123}, null, baton);

                event.trigger("PhoneEvent", [123, 456, 789], true);
                event.trigger("PhoneEvent", [123, 456, 789], true);

                expect(baton.pass.callCount).toBe(1);
            });
        });

        describe("activeCalls", function () {
            it("returns an array of active calls", function () {
                var callData = {
                        id: "id",
                        onhold: false,
                        outgoing: false,
                        recipient: {
                            name: "bob",
                            number: "3456789865"
                        }
                    },
                    call = new PhoneCall(callData.onhold),
                    activeCalls;

                call.outgoing = callData.outgoing;
                call.recipientName = callData.recipient.name;
                call.recipientNumber = callData.recipient.number;

                event.trigger("PhoneCallInitiated", [callData], true);
                activeCalls = phone.activeCalls().data;

                expect(activeCalls.length).toEqual(1);
                expect(activeCalls[0].outgoing).toEqual(call.outgoing);
                expect(activeCalls[0].recipientName).toEqual(call.recipientName);
                expect(activeCalls[0].recipientNumber).toEqual(call.recipientNumber);
                expect(activeCalls[0].isOnHold()).toEqual(call.isOnHold());

                event.trigger("PhoneCallEnded", [callData], true);
                expect(phone.activeCalls().data).toEqual([]);
            });
        });

        describe("inActiveCall", function () {
            it("returns false if no active calls", function () {
                expect(phone.inActiveCall().data).toEqual(false);
            });

            it("returns true if active calls", function () {
                var call = {
                    id: "another_id",
                    onhold: false,
                    outgoing: false,
                    recipient: {
                        name: "moe",
                        number: "3456789865"
                    }
                };

                event.trigger("PhoneCallInitiated", [call], true);
                expect(phone.inActiveCall().data).toEqual(true);
                event.trigger("PhoneCallEnded", [call], true);
            });
        });
    });
});
