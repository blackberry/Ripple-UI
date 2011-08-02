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
    utils = require('ripple/utils'),
    _uri = "blackberry/pim/appointment/";

function Appointment(service) {
    var _self = {
        allDay: false,
        attendees: [],
        end: null,
        freeBusy: null,
        location: null,
        note: null,
        recurrence: null,
        reminder: null,
        start: null,
        summary: null,
        uid: null,
        remove: function () {
            transport.call(_uri + "remove", {get: {uid: _self.uid}});
        },
        save: function () {
            if (_self.uid === null) {
                _self.uid  = Number(Math.uuid(8, 10));
            }
            transport.call(_uri + "save", {post: {appointment: _self}});
        }
    };

    return _self;
}

function _massage(property, name) {
    if (name === "recurrence" && property) {
        if (property.end) {
            property.end = new Date(property.end);
        }
    }
    if (name === "reminder" && property) {
        if (property.date) {
            property.date = new Date(property.date);
        }
    }
    if ((name === "end" || name === "start") && property) {
        property = new Date(property);
    }
    return property;
}

Appointment.find = function (filter, orderBy, maxReturn, service, isAscending) {
    var opts = {
        post: {
            filter: filter,
            orderBy: orderBy,
            maxReturn: maxReturn,
            service: service,
            isAscending: isAscending
        }
    };

    return transport.call(_uri + "find", opts).map(function (obj) {
        var appt = new Appointment();
        appt.allDay = obj.allDay;
        appt.attendees = obj.attendees;
        appt.end = _massage(obj.end, "end");
        appt.freeBusy = obj.freeBusy;
        appt.location = obj.location;
        appt.note = obj.note;
        appt.recurrence = _massage(obj.recurrence, "recurrence");
        appt.reminder = _massage(obj.reminder, "reminder");
        appt.start = _massage(obj.start, "start");
        appt.summary = obj.summary;
        appt.uid = obj.uid;
        return appt;
    });
};

Appointment.__defineGetter__("FREE", function () {
    return 0;
});
Appointment.__defineGetter__("TENTATIVE", function () {
    return 1;
});
Appointment.__defineGetter__("BUSY", function () {
    return 2;
});
Appointment.__defineGetter__("OUT_OF_OFFICE", function () {
    return 3;
});

module.exports = Appointment;
