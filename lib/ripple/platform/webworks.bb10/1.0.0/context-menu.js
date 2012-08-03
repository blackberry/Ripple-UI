
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
    ui = require('ripple/ui'),
    event = require('ripple/event'),
    utils = require('ripple/utils'),
    visibleArgs,
    contextmenu,
    menuVisible,
    menuPeeked,
    config,
    includePath,
    _currentContext,
    _listeningForCallbacks = false,
    _mouseDown = false,
    _enabled = true,
    _actions = require('./actions'),
    _customContextItems = {},
    _storedCallbacks = {},
    defaultContextMenuItems = {
        "IMAGE_LINK": ['Open', 'CopyLink', 'CopyImageLink', 'Cancel'],
        "IMAGE": ['CopyImageLink', 'SaveImage'],
        "LINK": ['Copy', 'CopyLink', 'Cancel'],
        "INPUT": ['Cut', 'Copy', 'ClearField', 'Cancel'],
        "TEXT": ['Copy', 'Cancel'],
        "ALL": ['Cancel']
    };

function generateMenuItems(menuItems) {
    var extensionUrl = document.getElementById('extension-url').innerText,
        items = utils.map(menuItems, function (menuItem) {
            switch (menuItem) {
            case 'ClearField':
                return {'label': 'Clear Field', 'actionId': 'ClearField', 'imageUrl': extensionUrl + 'images/Browser_Cancel_Selection.png'};
            case 'Cancel':
                return {'label': 'Cancel', 'actionId': 'Cancel', 'imageUrl': extensionUrl + 'images/Browser_Cancel_Selection.png'};
            case 'Cut':
                return {'label': 'Cut', 'actionId': 'Cut', 'imageUrl': extensionUrl + 'images/Browser_Cut.png'};
            case 'Copy':
                return {'label': 'Copy', 'actionId': 'Copy', 'imageUrl': extensionUrl + 'images/Browser_Copy.png'};
            case 'Paste':
                return {'label': 'Paste', 'actionId': 'Paste', 'imageUrl': extensionUrl + 'images/crosscutmenu_paste.png'};
            case 'Select':
                return {'label': 'Select', 'actionId': 'Select', 'imageUrl': extensionUrl + 'images/crosscutmenu_paste.png'};
            case 'CopyLink':
                return {'label': 'Copy Link', 'actionId': 'CopyLink', 'imageUrl': extensionUrl + 'images/Browser_CopyLink.png'};
            case 'CopyImageLink':
                return {'label': 'Copy Image Link', 'actionId': 'CopyImageLink', 'imageUrl': extensionUrl + 'images/Browser_CopyImageLink.png'};
            }
        });

    if (_currentContext && _currentContext.url && _currentContext.text) {
        items.push({'headText': _currentContext.text, 'subheadText': _currentContext.url});
    }

    return items;
}

function handleMouseLeaveMenu() {
    _mouseDown = false;
}

function init() {
    var menu = document.getElementById('contextMenu');
    menu.addEventListener('webkitTransitionEnd', contextmenu.transitionEnd.bind(contextmenu));

    jQuery(menu).mouseleave(handleMouseLeaveMenu.bind(this));
}

function listen() {
    event.on("contextmenu.executeMenuAction", function (actionId) {
        if (_storedCallbacks.hasOwnProperty(actionId)) {
            _storedCallbacks[actionId]();
        }
    });
}

function handleMouseUp(actionId, menuItem) {
    _mouseDown = false;

    if (!menuItem) {
        return;
    }

    menuItem.className = 'menuItem';

    // Run handler action for this menu item
    _actions.runHandler(actionId);
}

function handleMouseDown(menuItem) {
    _mouseDown = true;

    if (menuPeeked) {
        menuItem.className = 'menuItem showItem menuItemActive';
    } else if (menuVisible) {
        menuItem.className = 'menuItem menuItemActive';
    }
}

function handleMouseLeave(menuItem) {
    if (!menuItem) {
        return;
    }

    if (menuPeeked) {
        menuItem.className = 'menuItem peekItem';
    } else if (menuVisible) {
        menuItem.className = 'menuItem';
    }
}

function handleMouseEnter(menuItem) {
    if (!menuItem || !_mouseDown) {
        return;
    }

    // Instead of using the DOMActivate event, since we are triggering it by mouse enter/leave events,
    // just use a custom class style
    if (menuPeeked) {
        menuItem.className = 'menuItem showItem menuItemActive';
    } else if (menuVisible) {
        menuItem.className = 'menuItem menuItemActive';
    }
}

function safeEval(jsonString) {
    return JSON.parse('{"obj":' + jsonString + '}').obj;
}

function addItem(contexts, action, callback) {    
    // Check actionId is valid or if item already has been added
    if (!action.actionId || action.actionId === '') {
        throw 'Cannot add item.  actionId is not valid';
    } else if (!_actions.addCustomItem(action.actionId)) {
        throw 'Cannot add item.  A menu item with the actionId "' + action.actionId + '" already exists.';
    }

    utils.forEach(contexts, function (context) {
        if (!_customContextItems[context]) {
            _customContextItems[context] = {};
        }

        _customContextItems[context][action.actionId] = action; 
        _storedCallbacks[action.actionId] = callback;

        if (!_listeningForCallbacks) {
            listen();
            _listeningForCallbacks = true;
        }
    });
}

function removeItemFromAllContexts(actionId) {
    var everyContext = [_self.CONTEXT_ALL,
                        _self.CONTEXT_LINK, 
                        _self.CONTEXT_IMAGE_LINK,
                        _self.CONTEXT_IMAGE,
                        _self.CONTEXT_INPUT,
                        _self.CONTEXT_TEXT];

    utils.forEach(everyContext, function (context) {
        if (_customContextItems[context]) { 
            delete _customContextItems[context][actionId];
        }
    });
}

function removeItem(contexts, actionId) {
    utils.forEach(contexts, function (context) {
        if (context === _self.CONTEXT_ALL) {
            removeItemFromAllContexts(actionId);
        } else {
            if (_customContextItems[context]) {
                delete _customContextItems[context][actionId]; 
            }
        }
    });

    _actions.removeCustomItem(actionId);
    delete _storedCallbacks[actionId];
}

function addCustomItemsForContext(items, context) {       
    if (_customContextItems[context]) {
        utils.forEach(_customContextItems[context], function (customItem) {
            items.push(customItem); 
        });
    }
}

function addCustomItems(menuItems, currentContext) {
    var context;

    // Add ALL
    addCustomItemsForContext(menuItems, _self.CONTEXT_ALL);
   
    // Determine context
    if (currentContext.url && !currentContext.isImage) {
        context = _self.CONTEXT_LINK;
    }
    else if (currentContext.url && currentContext.isImage) {
        context = _self.CONTEXT_IMAGE_LINK;
    }
    else if (currentContext.isImage) {
        context = _self.CONTEXT_IMAGE;
    }
    else if (currentContext.isInput) {
        context = _self.CONTEXT_INPUT;
    }
    else if (currentContext.text) {
        context = _self.CONTEXT_TEXT;
    }

    addCustomItemsForContext(menuItems, context);
}

function restoreDefaultMenu() {
    _customContextItems = {};
    _actions.clearCustomHandlers();
}

function openContextMenu(context) {
    var items = [];

    if (_enabled) {
        visibleArgs = [context];

        ui.showOverlay("contextMenuWindow", function (menu) {
            contextmenu.init();
            contextmenu.setCurrentContext(context);
            items = generateMenuItems(defaultContextMenuItems[context]);
            addCustomItems(items, context);
            contextmenu.setMenuOptions(items);
            contextmenu.peekContextMenu(true);
        }, true);
    }
}

event.on("ContextMenuEvent", function (context, items) {
    openContextMenu(context, items);
});

event.on("LayoutChanged", function () {
    openContextMenu(visibleArgs);
});

contextmenu = {
    init: init,
    openContextMenu: openContextMenu,
    generateMenuItems: generateMenuItems,
    addItem: addItem,
    removeItem: removeItem,

    setMenuOptions: function (options) {
        var menu = document.getElementById("contextMenuContent"),
            i,
            header,
            menuItem,
            menuImage;

        while (menu.childNodes.length >= 1) {
            menu.removeChild(menu.firstChild);
        }
        contextmenu.setHeadText('');
        contextmenu.setSubheadText('');

        utils.forEach(options, function (option) {
            if (option.headText || option.subheadText) {
                header = document.getElementById('contextMenuHeader');
                header.className = 'contextMenuHeader';

                if (options[i].headText) {
                    contextmenu.setHeadText(option.headText);
                }

                if (options[i].subheadText) {
                    contextmenu.setSubheadText(option.subheadText);
                }
            } else {
                menuItem = document.createElement('div');
                menuImage = document.createElement('img');
                menuImage.src = option.imageUrl ? option.imageUrl : document.getElementById('extension-url').innerText + 'images/generic_81_81_placeholder.png';
                menuImage.setAttribute("class", "menuImage");
                menuItem.appendChild(menuImage);
                menuItem.appendChild(document.createTextNode(option.label));
                menuItem.setAttribute("class", "menuItem");
                menuItem.onmousedown = handleMouseDown.bind(this, menuItem);
                menuItem.onmouseup = handleMouseUp.bind(this, option.actionId, menuItem);

                // Attach mouseleave handler using jQuery since native mouseleave event fires on sub elements as well
                jQuery(menuItem).mouseleave(handleMouseLeave.bind(this, menuItem));
                jQuery(menuItem).mouseenter(handleMouseEnter.bind(this, menuItem));

                menuItem.addEventListener('mousedown', contextmenu.handleMouseDown, false);
                menu.appendChild(menuItem);
            }
        });
    },

    handleMouseDown: function (evt) {
        evt.preventDefault();
    },

    setHeadText: function (text) {
        var headText = document.getElementById('contextMenuHeadText');
        headText.innerText = text;
    },

    setSubheadText: function (text) {
        var subheadText = document.getElementById('contextMenuSubheadText');
        subheadText.innerText = text;
    },

    showContextMenu: function (evt) {
        if (menuVisible) {
            return;
        }
        var menu = document.getElementById('contextMenu');
        menu.className = 'showMenu';
        menuVisible = true;
        _mouseDown = false;
        if (menuPeeked) {
            evt.cancelBubble = true;
            menuPeeked = false;
        }
    },

    isMenuVisible: function () {
        return menuVisible || menuPeeked;
    },

    hideContextMenu: function () {
        if (!menuVisible && !menuPeeked) {
            return;
        }
        var menu = document.getElementById('contextMenu'),
            handle = document.getElementById('contextMenuHandle');
        menu.removeEventListener('mouseup', contextmenu.hideContextMenu, false);
        handle.removeEventListener('mouseup', contextmenu.showContextMenu, false);
        menuVisible = false;
        menuPeeked = false;
        _mouseDown = false;
        menu.className = 'hideMenu';
    },

    peekContextMenu: function (show, zIndex) {
        if (menuVisible || menuPeeked) {
            return;
        }

        var menu = document.getElementById('contextMenu'),
            handle = document.getElementById('contextMenuHandle');
        handle.className = 'showContextMenuHandle';
        menuVisible = false;
        menuPeeked = true;
        menu.className = 'peekContextMenu';
    },

    transitionEnd: function () {
        var menu = document.getElementById('contextMenu'),
            handle = document.getElementById('contextMenuHandle'),
            header;
        if (menuVisible) {
            menu.addEventListener('mouseup', contextmenu.hideContextMenu, false);
            handle.removeEventListener('mouseup', contextmenu.showContextMenu, false);
        } else if (menuPeeked) {
            handle.addEventListener('mouseup', contextmenu.showContextMenu, false);
            menu.addEventListener('mouseup', contextmenu.hideContextMenu, false);
        } else {
            header = document.getElementById('contextMenuHeader');
            header.className = '';
            contextmenu.setHeadText('');
            contextmenu.setSubheadText('');
        }
    },

    setCurrentContext: function (context) {
        _currentContext = context;
    }
};

_self = {
    addItem: function (context, action, callback) {
        addItem(context, action, callback);
    },

    removeItem: function (contexts, actionId) {
        removeItem(contexts, actionId);
    },

    enabled: _enabled
};

utils.defineReadOnlyField(_self, "CONTEXT_ALL");
utils.defineReadOnlyField(_self, "CONTEXT_LINK");
utils.defineReadOnlyField(_self, "CONTEXT_IMAGE_LINK");
utils.defineReadOnlyField(_self, "CONTEXT_IMAGE");
utils.defineReadOnlyField(_self, "CONTEXT_INPUT");
utils.defineReadOnlyField(_self, "CONTEXT_TEXT");

module.exports = _self;
