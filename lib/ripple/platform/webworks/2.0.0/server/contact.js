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
var select = require('ripple/platform/webworks/2.0.0/select'),
    db = require('ripple/db'),
    utils = require('ripple/utils'),
    _KEY = "blackberry-pim-contacts",
    _self;

function _defaultContacts() {
    return [{
        uuid: Math.uuid(null, 16),
        firstName: "Leonardo",
        homePhone: "4567892345",
        email1: "leo@underground.com"
    }, {
        uuid: Math.uuid(null, 16),
        firstName: "Raphael",
        homePhone: "4563457890",
        email1: "raph@underground.com"
    }, {
        uuid: Math.uuid(null, 16),
        firstName: "Michelangelo",
        homePhone: "4563453425",
        email1: "mike@underground.com"
    }, {
        uuid: Math.uuid(null, 16),
        firstName: "Donatello",
        homePhone: "4563453425",
        email1: "don@undergound.com"
    }];
}

function _get() {
    return db.retrieveObject(_KEY) || _defaultContacts();
}

function _save(contacts) {
    db.saveObject(_KEY, contacts);
}

_self = {
    save: function (get, post) {
        var contacts = _get(),
            properties = post.contact,
            id = properties.uid;

        contacts[id] = properties;
        _save(contacts);
        return {code: 1};
    },
    remove: function (get, post) {
        var contacts = _get(),
            id = get.id;

        delete contacts[id];
        _save(contacts);
        return {code: 1};
    },
    find: function (get, post) {
        var contacts = _get(),
            match = select.from(contacts);

        if (post.orderBy) {
            match.orderBy(post.orderBy, post.isAscending === false ? "desc" : "asc");
        }

        if (post.maxReturn) {
            match.max(post.maxReturn);
        }

        return {code: 1, data: match.where(post.filterField)};
    }
};

module.exports = _self;
