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
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    AddressBookItem = require('ripple/platform/wac/1.0/AddressBookItem'),
    CalendarItem = require('ripple/platform/wac/1.0/CalendarItem'),
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    constants = require('ripple/constants');

function _throwUnsupportedException(method) {
    exception.raise(ExceptionTypes.UNSUPPORTED, "Method not supported." + (method || ""), new Exception());
}

function _toAddressBookItem(contact) {
    if (!contact) {
        return null;
    }

    var addressBookItem = new AddressBookItem();

    utils.forEach(contact, function (prop, key) {
        addressBookItem[key] = contact[key];
    });

    return addressBookItem;
}

function _toCalendarItem(item) {
    if (!item) {
        return null;
    }

    var calendarItem = new CalendarItem();

    utils.forEach(item, function (prop, key) {
        calendarItem[key] = item[key];
    });

    return calendarItem;
}

function _getData(type) {
    var data = db.retrieveObject(type) || [];
    return data;
}

function _saveData(type, items) {
    db.saveObject(type, items);
}

function _getContacts() {
    var contacts = _getData(constants.PIM.ADDRESS_LIST_KEY),
        gord,
        dan,
        brent,
        pj,
        mark;

    if (contacts.length === 0) {

        gord = new AddressBookItem();
        gord.addressBookItemId = "0";
        gord.fullName = "Gord Tanner";
        gord.eMail = "gord@tinyHippos.com";
        gord.company = "tinyHippos Inc";
        gord.title = "Code Poet";
        gord.address = "121 Charles Street W, Kitchener, Ontario, Canada";

        dan = new AddressBookItem();
        dan.addressBookItemId = "1";
        dan.fullName = "Dan Silivestru";
        dan.eMail = "dan@tinyHippos.com";
        dan.company = "tinyHippos Inc";
        dan.title = "Co-Founder And Chief Technology Officer";
        dan.address = "121 Charles Street W, Kitchener, Ontario, Canada";

        pj = new AddressBookItem();
        pj.addressBookItemId = "2";
        pj.fullName = "PJ Lowe";
        pj.eMail = "pj@tinyHippos.com";
        pj.company = "tinyHippos Inc";
        pj.title = "Co-Founder And Chief Operations Officer";
        pj.address = "121 Charles Street W, Kitchener, Ontario, Canada";

        brent = new AddressBookItem();
        brent.addressBookItemId = "2";
        brent.fullName = "Brent Lintner";
        brent.eMail = "brent@tinyHippos.com";
        brent.company = "tinyHippos Inc";
        brent.title = "Co-Founder And Chief Operations Officer";
        brent.address = "121 Charles Street W, Kitchener, Ontario, Canada";

        mark = new AddressBookItem();
        mark.addressBookItemId = "3";
        mark.fullName = "Mark McArdle";
        mark.eMail = "mark@tinyHippos.com";
        mark.company = "tinyHippos Inc";
        mark.title = "Chief Executive Officer";
        mark.address = "121 Charles Street W, Kitchener, Ontario, Canada";

        contacts.push(gord);
        contacts.push(dan);
        contacts.push(pj);
        contacts.push(brent);
        contacts.push(mark);

        _saveData(constants.PIM.ADDRESS_LIST_KEY, contacts);
    }
    return contacts.map(_toAddressBookItem);
}

function _getEvents() {
    var events = _getData(constants.PIM.CALENDAR_LIST_KEY);
    return events.map(_toCalendarItem);
}

function _get(type, id, fetchIDFunc) {
    var items = _getData(type);
    return items.reduceRight(function (match, item) {
        return fetchIDFunc(item) === id ? item : match;
    }, null);
}

function _getAddressBookID(item) {
    return item.addressBookItemId;
}

function _getCalendarID(item) {
    return item.calendarItemId;
}

function _getContact(id) {
    return _toAddressBookItem(_get(constants.PIM.ADDRESS_LIST_KEY, id, _getAddressBookID));
}

function _getEvent(id) {
    return _toCalendarItem(_get(constants.PIM.CALENDAR_LIST_KEY, id, _getCalendarID));
}

function _add(type, item, idProp) {
    var items = _getData(type);

    if (!item[idProp]) {
        item[idProp] = Math.uuid(undefined, 16);
    }

    items.push(item);
    _saveData(type, items);
}

function _delete(type, id, fetchIDFunc) {
    var items = _getData(type);

    _saveData(type, items.filter(function (item) {
        return fetchIDFunc(item) !== id;
    }));
}

function _validateArgs(min, max, len) {
    utils.validateNumberOfArguments(min, max, len,
        ExceptionTypes.INVALID_PARAMETER, "invalid number of parameters", new Exception());
}

function _validateType(arg, argType) {
    utils.validateArgumentType(arg, argType,
        ExceptionTypes.INVALID_PARAMETER,  "argument of wrong type provided",
        new Exception());
}

function _validateAddressBookItem(item) {
    if ((item instanceof AddressBookItem) === false) {
        exception.raise(ExceptionTypes.INVALID_PARAMETER, "invalid contact, not instance of AddressBookItem.", new Exception());
    }
}

_self = {
    addAddressBookItem: function (contact) {
        _validateArgs(1, 1, arguments.length);
        _validateAddressBookItem(contact);

        _add(constants.PIM.ADDRESS_LIST_KEY, contact, "addressBookItemId");
    },
    createAddressBookGroup: function (groupName) {
        _throwUnsupportedException("Widget.PIM.createAddressBookGroup");
    },
    createAddressBookItem: function () {
        return new AddressBookItem();
    },
    deleteAddressBookItem: function (contactid) {
        _validateArgs(1, 1, arguments.length);
        _validateType(contactid, "string");
        _delete(constants.PIM.ADDRESS_LIST_KEY, contactid, _getAddressBookID);
    },
    deleteAddressBookGroup: function (groupName) {
        _throwUnsupportedException("Widget.PIM.deleteAddressBookGroup");
    },
    getAddressBookItem: function (contactid) {
        _validateArgs(1, 1, arguments.length);
        _validateType(contactid, "string");
        return _getContact(contactid);
    },
    getAddressBookItemsCount: function () {
        _validateArgs(0, 0, arguments.length);
        var items = _getContacts();
        return items.length;
    },
    getAvailableAddressGroupNames: function () {
        _throwUnsupportedException("Widget.PIM.getAvailableAddressGroupNames");
    },
    getAddressBookGroupMembers: function (groupName) {
        _throwUnsupportedException("Widget.PIM.getAddressBookGroupMembers");
    },
    findAddressBookItems: function (comparisonContact, startInx, endInx) {
        _validateArgs(3, 3, arguments.length);
        utils.validateMultipleArgumentTypes([comparisonContact, startInx, endInx], ["object", "number", "number"], ExceptionTypes.INVALID_PARAMETER,  "argument of wrong type provided",
            new Exception());

        if (endInx < 0) {
            exception.raise(ExceptionTypes.INVALID_PARAMETER, "invalid number of parameters", new Exception());
        }

        startInx = startInx < 0 ? 0 : startInx;

        var contacts = _getContacts();
        utils.find(comparisonContact, contacts, startInx, endInx, _self.onAddressBookItemsFound);
    },

    addCalendarItem: function (calendarItem) {
        _validateArgs(1, 1, arguments.length);
        _add(constants.PIM.CALENDAR_LIST_KEY, calendarItem, "calendarItemId");
    },
    deleteCalendarItem: function (calendarId) {
        _validateArgs(1, 1, arguments.length);
        _delete(constants.PIM.CALENDAR_LIST_KEY, calendarId, _getCalendarID);
    },
    getCalendarItem: function (calendarId) {
        _validateArgs(1, 1, arguments.length);
        return _getEvent(calendarId);
    },
    findCalendarItems: function (itemToMatch, startInx, endInx) {
        _validateArgs(1, 3, arguments.length);
        var events = _getEvents();
        utils.find(itemToMatch, events, startInx, endInx, _self.onCalendarItemsFound);
    },
    getCalendarItems: function (startTime, endTime) {
        var events = _getEvents();

        return events.reduce(function (matches, event) {
            if (event.eventStartTime >= startTime && event.eventStartTime <= endTime) {
                matches.push(event);
            }
            return matches;
        }, []);
    },
    exportAsVCard: function (addressBookItems) {
        _throwUnsupportedException("Widget.PIM.exportAsVCard");
    },

    onAddressBookItemsFound: undefined, // function (addressBookItemsFound) { }
    onCalendarItemsFound: undefined, // function (calendarItemsFound) { }
    onCalendarItemAlert: undefined, // function (calendarItem) { }
    onVCardExportingFinish: undefined // function (vCardFilePath) { }
};

module.exports = _self;
