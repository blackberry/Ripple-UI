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
    utils = require('ripple/utils'),
    onSelect,
    _items = {},
    _uri = "blackberry/ui/menu/",
    _self;

_self = {
    addMenuItem: function (menuItem) {
        _items[menuItem.id] = menuItem;

        transport.call(_uri + "addMenuItem", {
            get: {"item": menuItem}
        });

        if (utils.count(_items) === 1) {
            transport.poll(_uri + "onSelect", {}, function (response) {
                var item = _items[response];

                if (item && item.callback) {
                    item.callback();
                }

                return !!utils.count(_items);
            });
        }
    },

    clearMenuItems: function () {
        _items = {};
        transport.call(_uri + "clearMenuItems");
    },

    getMenuItems: function () {
        return utils.copy(_items);
    },

    hasMenuItem: function (menuItem) {
        return !!_items[menuItem.id];
    },

    open: function () {
        transport.call(_uri + "open", {async: true});
    },

    removeMenuItem: function (menuItem) {
        delete _items[menuItem.id];
        transport.call(_uri + "removeMenuItem", {
            get: {item: menuItem}
        });
    },

    setDefaultMenuItem: function (menuItem) {
        utils.forEach(_items, function (item) {
            item.isDefault = false;
        });

        _items[menuItem.id].isDefault = true;

        transport.call(_uri + "setDefaultMenuItem", {
            get: {id: menuItem.id}
        });
    }
};

module.exports = _self;
