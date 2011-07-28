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
describe("webworks pim appointment", function () {
    var appointment = require('ripple/platform/webworks/2.0.0/server/appointment'),
        Appointment = require('ripple/platform/webworks/2.0.0/client/Appointment'),
        Recurrence = require('ripple/platform/webworks/2.0.0/client/Recurrence'),
        Reminder = require('ripple/platform/webworks/2.0.0/client/Reminder'),
        transport = require('ripple/platform/webworks/2.0.0/client/transport'),
        db = require('ripple/db'),
        utils = require('ripple/utils'),
        select = require('ripple/platform/webworks/2.0.0/select'),
        FilterExpression = require('ripple/platform/webworks/2.0.0/client/FilterExpression'),
        webworks = require('ripple/platform/webworks/2.0.0/server');

    describe("using server", function () {
        it("exposes the appointment module", function () {
            expect(webworks.blackberry.pim.appointment).toEqual(appointment);
        });
    });

    describe("client", function () {
        describe("save", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn(2);
                spyOn(Math, "uuid").andReturn("33");

                var app = new Appointment();
                app.save();

                expect(app.uid).toEqual(33);
                expect(transport.call).toHaveBeenCalledWith("blackberry/pim/appointment/save", {
                    post: {appointment: app}
                });
            });
        });

        describe("remove", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn(2);

                var app = new Appointment();
                app.uid = 345;
                app.remove();

                expect(transport.call).toHaveBeenCalledWith("blackberry/pim/appointment/remove", {
                    get: {uid: app.uid}
                });
            });
        });

        describe("when finding appointments", function () {
            it("calls the transport with proper args", function () {
                var apps = [];
                spyOn(transport, "call").andReturn(apps);
                expect(Appointment.find(1, 2, 3, 4, 5)).toEqual(apps);
                expect(transport.call).toHaveBeenCalledWith("blackberry/pim/appointment/find", {
                    post: {
                        filter: 1,
                        orderBy: 2,
                        maxReturn: 3,
                        service: 4,
                        isAscending: 5
                    }
                });
            });

            it("returns an array of massaged Appointment objects", function () {
                var appointment = new Appointment(),
                    appointments;

                appointment.uid = "id";
                appointment.note = "value";
                appointment.start = new Date();
                appointment.end = new Date();
                appointment.recurrence = new Recurrence();
                appointment.recurrence.end = new Date();
                appointment.reminder = new Reminder();
                appointment.reminder.date = new Date();

                spyOn(transport, "call").andReturn([JSON.parse(JSON.stringify(appointment))]);

                appointments = Appointment.find();

                expect(appointments.length).toEqual(1);
                expect(appointments[0].uid).toEqual(appointment.uid);
                expect(appointments[0].note).toEqual(appointment.note);
                expect(appointments[0].start).toEqual(appointment.start);
                expect(appointments[0].end).toEqual(appointment.end);
                expect(appointments[0].recurrence.end).toEqual(appointment.recurrence.end);
                expect(appointments[0].reminder.date).toEqual(appointment.reminder.date);
            });
        });
    });

    describe("when saving", function () {
        it("can save a new appointment", function () {
            var sched = {},
                a = new Appointment();

            spyOn(db, "retrieveObject").andReturn(sched);
            spyOn(db, "saveObject");

            appointment.save(null, {appointment: a});

            expect(sched[a.uid]).toBe(a);
            expect(db.saveObject.callCount).toBe(1);
        });

        it("can save an existing appointment", function () {
            var appointments = {},
                a;

            a = new Appointment();
            a.uid = 123;
            a.note = "orig";

            appointments[a.uid] = a;

            spyOn(db, "retrieveObject").andReturn(appointments);
            spyOn(db, "saveObject");

            a = utils.copy(a);
            a.note = "updated!";

            appointment.save(null, {appointment: a});
            expect(appointments[a.uid]).toBe(a);

        });
    });

    describe("when removing an appointment object", function () {
        it("removes from the persisted list", function () {
            var appts = {
                    "42": {
                        uid: "42",
                    }
                };

            spyOn(db, "retrieveObject").andReturn(appts);
            spyOn(db, "saveObject");

            appointment.remove({uid: "42"});

            expect(appts["42"]).not.toBeDefined();

        });

        it("throws an exception if the uid doesn't exist", function () {
            spyOn(db, "retrieveObject").andReturn({});
            spyOn(db, "saveObject");

            expect(function () {
                appointment.remove({uid: "42"});
            }).toThrow();

            expect(db.saveObject.callCount).toBe(0);

        });

        it("doesn't delete items that don't match the UID", function () {
            var appts = {
                    "1": {},
                    "3": {},
                    "4": {},
                    "2": {}
                };

            spyOn(db, "retrieveObject").andReturn(appts);
            spyOn(db, "saveObject");

            appointment.remove({uid: "1"});

            expect(utils.count(appts)).toBe(3);
            expect(appts["3"]).toBeDefined();

        });
    });

    describe("when finding an appointment object", function () {
        var from;
        beforeEach(function () {
            from = {
                where: jasmine.createSpy().andReturn([])
            };
            from.orderBy = jasmine.createSpy().andReturn(from);
            from.max = jasmine.createSpy().andReturn(from);
        });

        it("calls select module with filter expression", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            appointment.find(null, {filter: filter});
            expect(from.where).toHaveBeenCalledWith(filter);
        });

        it("passes orderBy and defaults isAscending to 'asc' when isAscending is not provided", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            appointment.find(null, {filter: filter, orderBy: "foo"});
            expect(from.orderBy).toHaveBeenCalledWith("foo", "asc");
        });

        it("passes orderBy and sets isAscending to 'asc' when isAscending is true", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            appointment.find(null, {filter: filter, orderBy: "foo", isAscending: true});
            expect(from.orderBy).toHaveBeenCalledWith("foo", "asc");
        });

        it("passes orderBy and sets isAscending to 'desc' when isAscending is false", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            appointment.find(null, {filter: filter, orderBy: "foo", isAscending: false});
            expect(from.orderBy).toHaveBeenCalledWith("foo", "desc");
        });

        it("passes maxReturn", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            appointment.find(null, {filter: filter, maxReturn: 10});
            expect(from.max).toHaveBeenCalledWith(10);
        });
    });
});
