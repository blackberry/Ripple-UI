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
var utils = require('ripple/utils'),
    exception = require('ripple/exception'),
    db = require('ripple/db'),
    constants = require('ripple/constants'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes');

function _validateArgs(min, max, len) {
    utils.validateNumberOfArguments(min, max, len,
        ExceptionTypes.INVALID_PARAMETER, "invalid number of parameters", new Exception());
}

function _validateType(arg, argType) {
    utils.validateArgumentType(arg, argType,
        ExceptionTypes.INVALID_PARAMETER,  "argument of wrong type provided",
        new Exception());
}

module.exports = function () {
    function _throwUnsupportedException(method) {
        exception.raise(ExceptionTypes.UNSUPPORTED, "Method not supported." + (method || ""), new Exception());
    }

    this.addressBookItemId = undefined;
    this.fullName = undefined;
    this.mobilePhone = undefined;
    this.homePhone = undefined;
    this.workPhone = undefined;
    this.eMail = undefined;
    this.company = undefined;
    this.title = undefined;
    this.address = undefined;

    this.setAttributeValue = function (attribute, value) {
        _validateArgs(2, 2, arguments.length);
        _validateType(attribute, "string");
        this[attribute] = value;
    };
    this.setAddressGroupNames = function (groups) {
        _throwUnsupportedException("PIM.AddressBookItem.setAddressGroupNames");
    };
    this.getAttributeValue = function (attribute) {
        _validateArgs(1, 1, arguments.length);
        _validateType(attribute, "string");
        return this[attribute];
    };
    this.getAddressGroupNames = function () {
        _throwUnsupportedException("PIM.AddressBookItem.getAddressGroupNames");
    };
    this.getAvailableAttributes = function () {
        return utils.reduce(this, function (attributes, value, key) {
            if (typeof(value) !== 'function') {
                attributes.push(key);
            }
            return attributes;
        }, []).sort();
    };
    this.update = function () {
        var items = db.retrieveObject(constants.PIM.ADDRESS_LIST_KEY),
            that = this,
            itemIndex = items.reduce(function (current, value, i) {
                return value.addressBookItemId === that.addressBookItemId ?
                    i : current;
            }, -1);

        if (itemIndex >= 0) {
            items[itemIndex] = this;
            db.saveObject(constants.PIM.ADDRESS_LIST_KEY, items);
        }
        else {
            exception.raise(ExceptionTypes.INVALID_PARAMETER, "Address Book Item not found: " + (this.addressBookItemId || ""), new Exception());
        }

    };
};
