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
var Contact = ripple('platform/cordova/1.0.0/Contact'),
    ContactName = ripple('platform/cordova/1.0.0/ContactName'),
    ContactError = ripple('platform/cordova/1.0.0/ContactError'),
    ContactField = ripple('platform/cordova/1.0.0/ContactField'),
    utils = ripple('utils'),
    db = ripple('db'),
    event = ripple('event'),
    _defaultContacts =
    [{
        "id": Math.uuid(undefined, 16),
        "name": new ContactName("Brent Lintner"),
        "displayName": "Brent Lintner",
        "emails": [new ContactField("work", "brent@tinyhippos.com", false)]
    }, {
        "id": Math.uuid(undefined, 16),
        "name": new ContactName("PJ Lowe"),
        "displayName": "PJ Lowe",
        "emails": [new ContactField("work", "pj@tinyhippos.com", false)]
    }, {
        "id": Math.uuid(undefined, 16),
        "name": new ContactName("Dan Silivestru"),
        "displayName": "Dan Silivestru",
        "emails": [new ContactField("work", "dan@tinyhippos.com", false)]
    }, {
        "id": Math.uuid(undefined, 16),
        "name": new ContactName("Gord Tanner"),
        "displayName": "Gord Tanner",
        "emails": [new ContactField("work", "gord@tinyhippos.com", true)]
    }, {
        "id": Math.uuid(undefined, 16),
        "name": new ContactName("Mark McArdle"),
        "displayName": "Mark McArdle",
        "emails": [new ContactField("work", "mark@tinyhippos.com", false)]
    }],
    self;

function _error(callback, code, msg) {
    var e = new ContactError();
    e.code = code;
    e.message = msg;
    window.setTimeout(function () {
        callback(e);
    }, 1);
}


function _getContacts() {
    return db.retrieveObject("phonegap-contacts") ||
        _defaultContacts.map(function (person) {
            var contact = new Contact();
            contact.updated = new Date();
            utils.forEach(person, function (value, prop) {
                contact[prop] = value;
            });

            return contact;
        });
}

function _saveContacts(contacts) {
    db.saveObject("phonegap-contacts", contacts);
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

event.on("phonegap-contact-save", function (contactProperties, success) {
    var contacts = _getContacts(),
        existsIndex = contacts.reduce(function (result, value, index) {
            return value.id === contactProperties.id ? index : result;
        }, -1),
        contact = existsIndex >= 0 ? contacts[existsIndex] : new Contact();

    utils.mixin(contactProperties, contact);
    if (existsIndex < 0) {
        contacts.push(contact);
    }
    _saveContacts(contacts);
    success(contact);
});

event.on("phonegap-contact-remove", function (id, success, error) {
    if (!id) {
        _error(error, ContactError.NOT_FOUND_ERROR, "id is falsy (" + id + ")");
    } else {
        var contacts = _getContacts(),
            toDelete = contacts.reduce(function (result, current, index) {
                return current.id === id ? index : result;
            }, -1);

        if (toDelete >= 0) {
            contacts.splice(toDelete, 1);
            _saveContacts(contacts);
            success();
        } else {
            _error(error, ContactError.NOT_FOUND_ERROR, "could not find contact with id (" + id + ")");
        }
    }
});

self = module.exports = {
    create: function (properties) {
        var contact = new Contact();
        utils.forEach(properties, function (value, key) {
            contact[key] = value;
        });
        return contact;
    },
    find: function (fields, success, error, options) {
        var foundContacts = [],
            tempContact = self.create(),
            contacts = _getContacts(),
            errorFlag = false;

        options = options || {};

        // not a fan of error handling at the moment
        if (!fields || !("forEach" in fields)) {
            errorFlag = true;
            _error(error, ContactError.INVALID_ARGUMENT_ERROR, "missing contact fields array");
            return;
        }

        // handle special case of ["*"] to return all fields
        if (fields.length === 1 && fields[0] === "*") {
            fields = utils.map(tempContact, function (v, k) {
                return k;
            });
        }

        fields.forEach(function (prop) {
            if (!(tempContact.hasOwnProperty(prop))) {
                errorFlag = true;
                _error(error, ContactError.INVALID_ARGUMENT_ERROR, "invalid contact field (" + prop + ")");
            }
        });

        if (typeof success !== "function" && !errorFlag) {
            errorFlag = true;
            _error(error, ContactError.INVALID_ARGUMENT_ERROR, "missing success callback");
        }

        if (errorFlag) {
            return;
        }

        if (fields.length > 0) {
            contacts.forEach(function (contact) {
                var newContact = utils.copy(contact);

                if (options && (!_filtered(contact, options) ||
                        options.updatedSince && contact.updated && contact.updated.getTime() < options.updatedSince.getTime())) {
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

        window.setTimeout(function () {
            // TODO: don't loop over entire db just to slice the array
            if (options.multiple === false) {
                foundContacts = foundContacts.splice(0, 1);
            }
            success(foundContacts);
        }, 1);
    }
};
