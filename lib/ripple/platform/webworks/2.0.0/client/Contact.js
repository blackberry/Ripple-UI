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
    _uri = "blackberry/pim/contact/";

function Contact(service) {
    var _self = {
        anniversary: null,
        birthday: null,
        categories: [],
        company: null,
        email1: null,
        email2: null,
        email3: null,
        faxPhone: null,
        firstName: null,
        homeAddress: null,
        homePhone: null,
        homePhone2: null,
        jobTitle: null,
        lastName: null,
        mobilePhone: null,
        note: null,
        otherPhone: null,
        pagerPhone: null,
        picture: null,
        pin: null,
        title: null,
        uid: null,
        user1: null,
        user2: null,
        user3: null,
        user4: null,
        webpage: null,
        workAddress: null,
        workPhone: null,
        workPhone2: null,
        remove: function () {
            if (!_self.uid) {
                throw "task has not yet been saved (has no uid)";
            }
            transport.call(_uri + "remove", {
                get: { id: _self.uid }
            });
        },
        save: function () {
            if (!_self.uid) {
                _self.uid = Math.uuid(null, 16);
            }
            transport.call(_uri + "save", {
                post: { contact: _self }
            });
        },
        setPicture: function (picture) {
            throw "not implemented";
        }
    };

    return _self;
}

function _massage(property, name) {
    if ((name === "anniversary" || name === "birthday") && property) {
        return new Date(property);
    }
    return property;
}

Contact.find = function (fieldFilter, orderBy, maxReturn, service, isAscending) {
    return transport.call(_uri + "find", {
        post: {
            fieldFilter: fieldFilter,
            orderBy: orderBy,
            maxReturn: maxReturn,
            service: service,
            isAscending: isAscending
        }
    }).map(function (properties) {
        var contact = new Contact(),
            key;
        for (key in properties) {
            if (contact.hasOwnProperty(key)) {
                contact[key] = _massage(properties[key], key);
            }
        }
        return contact;
    });
};

module.exports = Contact;
