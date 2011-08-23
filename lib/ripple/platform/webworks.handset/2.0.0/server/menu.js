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
var _menuItems = {},
    constants = require('ripple/constants'),
    event = require('ripple/event'),
    events = require('ripple/platform/webworks.core/2.0.0/client/events'),
    ui = require('ripple/ui'),
    devices = require('ripple/devices'),
    utils = require('ripple/utils'),
    tooltip = require('ripple/ui/plugins/tooltip'),
    _self,
    isMenuOpen = false,
    _baton,
    menuWindow = document ? document.getElementById("menu-window") : undefined;

if (menuWindow) {
    menuWindow.addEventListener("click", function () {
        _self.close();
    });
}

event.on("LayoutChanged", function () {
    if (isMenuOpen) {
        _self.close();
        //Used to resize menu on orientation change
        _self.open();
    }
});

event.on("HardwareKeyDefault", function (key) {
    if (key === 1 || key === "1") { //menu button key
        if (isMenuOpen) {
            _self.close();
        }
        else {
            _self.open();
        }
    }
});

event.on("MenuItemSelected", function (menuItem) {
    var baton = _baton;
    _baton = null;
    return baton && baton.pass({code: 1, data: menuItem});
});

_self = {

    onSelect : function (args, post, baton) {
        baton.take();
        _baton = baton;
    },

    addMenuItem: function (args) {
        if (!args) {
            throw "item not found";
        }
        _menuItems[args.item.id] = args.item;
        event.trigger("MenuChanged", [_menuItems]);
        return {code: 1};
    },

    clearMenuItems: function () {
        _menuItems = {};
        event.trigger("MenuChanged", [utils.copy(_menuItems)]);
        return {code: 1};
    },

    open: function () {
        function _return() {
            return {code: 1};
        }

        if (utils.count(_menuItems) === 0) {
            _return();
        }

        ui.showOverlay("menu-window", function (menu) {
            var container = document.getElementById(constants.COMMON.VIEWPORT_CONTAINER),
                height = window.getComputedStyle(container, null).getPropertyValue("height"),
                width = window.getComputedStyle(container, null).getPropertyValue("width"),
                menuButtons = document.getElementById("menu-buttons"),
                sorted,
                menuItem;

            if (!menuButtons) {
                _return();
            }

            menu.setAttribute("style", "display:block;height:" + height + "; width:" + width + ";");
            isMenuOpen = true;

            sorted = utils.map(_menuItems, function (item) {
                return item;
            }).sort(function (a, b) {
                return a.ordinal - b.ordinal;
            });

            menuButtons.innerHTML = "";
            sorted.forEach(function (item) {
                if (!item.isSeparator) {
                    if (item.isDefault) {
                        menuItem = utils.createElement("div", {
                            "class": "overlay-menu-item-default",
                            "id": "default-menu-item"
                        });
                    }
                    else {
                        menuItem = utils.createElement("div", {
                            "class": "overlay-menu-item"
                        });
                    }
                    menuItem.innerHTML = item.caption;

                    menuItem.addEventListener("click", function () {
                        _baton.pass({code: 1, data: item.id});
                    });
                }
                else {
                    menuItem = utils.createElement("hr", {});
                }
                menuButtons.appendChild(menuItem);
                tooltip.create("#default-menu-item", "Default Item");
            });
        }, true);

        event.trigger("MenuOpened", []);

        _return();
    },

    close: function () {
        ui.hideOverlay("menu-window", function (menu) {
            var menuButtons = document.getElementById("menu-buttons");
            menuButtons.innerHTML = "";
            isMenuOpen = false;
            menu.setAttribute("style", "display:none;");

        });
        return {code: 1};
    },

    removeMenuItem: function (args) {
        delete _menuItems[args.item.id];
        event.trigger("MenuChanged", [_menuItems]);
        return {code: 1};
    },

    setDefaultMenuItem: function (args) {

        utils.forEach(_menuItems, function (item) {
            item.isDefault = false;
        });

        _menuItems[args.id].isDefault = true;

        event.trigger("DefaultItemChanged", [_menuItems[args.id]]);
        return {code: 1};
    }
};

module.exports = _self;
