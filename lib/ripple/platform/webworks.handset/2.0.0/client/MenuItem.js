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
var transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    event = require('ripple/event');

function MenuItem(isSeparator, ordinal, caption, callback) {
    var _isDefault = false,
	id = Math.uuid();

    if (ordinal < 0) {
        throw "Ordinal cannot be less than 0";
    } else if (isSeparator) {
        if (caption !== undefined) {
            throw "caption must not be supplied";
        } else if (callback !== undefined) {
            throw "callback must not be supplied";
        }
    } else if (!isSeparator) {
        if (caption === undefined) {
            throw "caption must be supplied";
        }
    }

    this.callback = callback;

    this.__defineSetter__("id", function (i) {
        id = i;
    });

    this.__defineGetter__("id", function () {
        return id;
    });

    this.__defineSetter__("caption", function (c) {
        caption = c;
        event.trigger("MenuItemChanged", [this]);
    });

    this.__defineGetter__("caption", function () {
        return caption;
    });

    this.__defineSetter__("ordinal", function (o) {
        ordinal = o;
        event.trigger("MenuItemChanged", [this]);
    });

    this.__defineGetter__("ordinal", function () {
        return ordinal;
    });

    this.__defineGetter__("isSeparator", function () {
        return isSeparator;
    });

    this.__defineSetter__("isDefault", function (d) {
        _isDefault = d;
        event.trigger("MenuItemChanged", [this]);
    });

    this.__defineGetter__("isDefault", function () {
        return _isDefault;
    });

    this.__defineGetter__("id", function () {
        return id;
    });
}

module.exports = MenuItem;
