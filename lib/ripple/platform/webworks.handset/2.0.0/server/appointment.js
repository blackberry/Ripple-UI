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
var db = require('ripple/db'),
    select = require('ripple/platform/webworks.core/2.0.0/select'),
    _self;

function _get() {
    return db.retrieveObject("webworks-pim-appointment-list") || {};
}

function _do(func) {
    var appointments = _get();
    func(appointments);
    db.saveObject("webworks-pim-appointment-list", appointments);
}

_self = {
    find: function (get, post) {
        var appointments = _get(),
            data = select.from(appointments)
                    .orderBy(post.orderBy, post.isAscending === false ? "desc" : "asc")
                    .max(post.maxReturn)
                    .where(post.filter);

        return {code: 1, data: data};
    },

    remove: function (get) {
        _do(function (appointments) {
            if (!appointments[get.uid]) {
                throw "attempting to delete a non existent appointment with uid: " + get.uid;
            }
            delete appointments[get.uid];
        });

        return {code: 1};
    },

    save: function (get, post) {
        _do(function (appointments) {
            appointments[post.appointment.uid] = post.appointment;
        });

        return {code: 1};
    }
};

module.exports = _self;
