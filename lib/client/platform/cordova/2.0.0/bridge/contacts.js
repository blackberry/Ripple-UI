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
var db = ripple('db'),
    utils = ripple('utils'),
    _self;

function _default() {
    return [{
        "name": {formatted: "Brent Lintner"},
        "displayName": "Brent Lintner",
        "emails": [{type: "work", value: "brent@tinyhippos.com", pref: false}]
    }, {
        "name": {formatted: "PJ Lowe"},
        "displayName": "PJ Lowe",
        "emails": [{type: "work", value: "pj@tinyhippos.com", pref: false}]
    }, {
        "name": {formatted: "Dan Silivestru"},
        "displayName": "Dan Silivestru",
        "emails": [{type: "work", value: "dan@tinyhippos.com", pref: false}]
    }, {
        "name": {formatted: "Gord Tanner"},
        "displayName": "Gord Tanner",
        "emails": [{type: "work", value: "gord@tinyhippos.com", pref: true}]
    }, {
        "name": {formatted: "Mark McArdle"},
        "displayName": "Mark McArdle",
        "emails": [{type: "work", value: "mark@tinyhippos.com", pref: false}]
    }].map(function (obj) {
        obj.id = Math.uuid(undefined, 16);
        return navigator.contacts.create(obj);
    });
}

function _get() {
    var contacts = db.retrieveObject("cordova-contacts");
    if (!contacts) {
        contacts = _default();
        _save(contacts);
    }
    return contacts;
}

function _save(contacts) {
    db.saveObject("cordova-contacts", contacts);
}

function _filtered(compare, options) {
    // this could be done a lot better..
    var found = false;
    if (!options.filter || options.filter === "") {
        found = true;
    } else if (typeof compare === "string" &&
              compare.match(new RegExp(".*" + options.filter + ".*", "i"))) {
        found = true;
    } else if (typeof compare === "object" || compare instanceof Array) {
        utils.forEach(compare, function (value) {
            if (!found) {
                found = _filtered(value, options);
            }
        });
    }
    return found;
}

_self = {
    search: function (success, error, args) {
        var fields = args[0],
            options = args[1],
            foundContacts = [],
            tempContact = navigator.contacts.create(),
            contacts = _get();

        options = options || {};

        // handle special case of ["*"] to return all fields
        if (fields.length === 1 && fields[0] === "*") {
            fields = utils.map(tempContact, function (v, k) {
                return k;
            });
        }

        if (fields.length > 0) {
            contacts.forEach(function (contact) {
                var newContact = navigator.contacts.create(contact);

                if (options && (!_filtered(contact, options))) {
                    return;
                }

                utils.forEach(newContact, function (value, prop) {
                    if (typeof newContact[prop] !== "function" && prop !== "id" &&
                        !fields.some(function (field) {
                            return field === prop;
                        })) {
                        delete newContact[prop];
                    }
                });

                foundContacts.push(newContact);
            });
        }

        // TODO: don't loop over entire db just to slice the array
        if (options.multiple === false) {
            foundContacts = foundContacts.splice(0, 1);
        }
        success(foundContacts);
    },

    save: function (success, error, args) {
        var contacts = _get(),
            contact = args[0],
            index;

        if (!contact.id) {
            contact.id = Math.uuid(undefined, 16);
            contacts.push(contact);
        } else {
            index = contacts.reduce(function (result, value, index) {
                return value.id === contact.id ? index : result;
            }, -1);

            if (index >= 0) {
                utils.mixin(contact, contacts[index]);
                contact = contacts[index];
            } else {
                contact = null;
            }
        }

        _save(contacts);
        if (success) {
            success(contact);
        }
    },

    remove: function (success, error, args) {
        var contacts = _get(),
            id = args[0],
            toDelete = contacts.reduce(function (result, current, index) {
                return current.id === id ? index : result;
            }, -1);

        if (toDelete >= 0) {
            contacts.splice(toDelete, 1);
            _save(contacts);
            if (success) {
                success();
            }
        } else {
            error({code: 3, message: "could not find contact with id (" + id + ")"}); // PENDING_OPERATION_ERROR
        }
    }
};

module.exports = _self;
