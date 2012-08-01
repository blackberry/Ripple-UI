
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
    _listeningForCallbacks,
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
    var items = [],
        i,
        extensionUrl = document.getElementById('extension-url').innerText;

    for (i = 0; i < menuItems.length; i++) {
        switch (menuItems[i]) {
        case 'ClearField':
            items.push({'label': 'Clear Field', 'actionId': 'ClearField', 'imageUrl': extensionUrl + 'images/Browser_Cancel_Selection.png'});
            break;
        case 'Cancel':
            items.push({'label': 'Cancel', 'actionId': 'Cancel', 'imageUrl': extensionUrl + 'images/Browser_Cancel_Selection.png'});
            break;
        case 'Cut':
            items.push({'label': 'Cut', 'actionId': 'Cut', 'imageUrl': extensionUrl + 'images/Browser_Cut.png'});
            break;
        case 'Copy':
            items.push({'label': 'Copy', 'actionId': 'Copy', 'imageUrl': extensionUrl + 'images/Browser_Copy.png'});
            break;
        case 'Paste':
            items.push({'label': 'Paste', 'actionId': 'Paste', 'imageUrl': extensionUrl + 'images/crosscutmenu_paste.png'});
            break;
        case 'Select':
            items.push({'label': 'Select', 'actionId': 'Select', 'imageUrl': extensionUrl + 'images/crosscutmenu_paste.png'});
            break;
        case 'CopyLink':
            items.push({'label': 'Copy Link', 'actionId': 'CopyLink', 'imageUrl': extensionUrl + 'images/Browser_CopyLink.png'});
            break;
        case 'CopyImageLink':
            items.push({'label': 'Copy Image Link', 'actionId': 'CopyImageLink', 'imageUrl': extensionUrl + 'images/Browser_CopyImageLink.png'});
            break;
        }
    }

    if (_currentContext && _currentContext.url && _currentContext.text) {
        items.push({'headText': _currentContext.text, 'subheadText': _currentContext.url});
    }

    return items;
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
        _storedCallbacks[actionId]();
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
    var context;
    
    // Check actionId is valid or if item already has been added
    if (!action.actionId || action.actionId === '') {
        //return fail('Cannot add item.  actionId is not valid');
    } else if (!_actions.addCustomItem(action.actionId)) {
        //return fail('Cannot add item.  A menu item with the actionId "' + action.actionId + '" already exists.');
    }

    for (context in contexts) {
        if (!_customContextItems[contexts[context]]) {
            _customContextItems[contexts[context]] = {};
        }

        _customContextItems[contexts[context]][action.actionId] = action; 
        _storedCallbacks[action.actionId] = callback;

        if (!_listeningForCallbacks) {
            listen();
        }
    }
}

function removeItem(contexts, actionId) {
    var context;

    for (context in contexts) {
        if (contexts[context] === _self.CONTEXT_ALL) {
            removeItemFromAllContexts(actionId);
        } else {
            if (_customContextItems[contexts[context]]) {
                delete _customContextItems[contexts[context]][actionId]; 
            }
        }
    }

    _actions.removeCustomItem(actionId);
    delete _storedCallbacks[actionId];
}

function removeItemFromAllContexts(actionId) {
    var everyContext = [_self.CONTEXT_ALL,
                        _self.CONTEXT_LINK, 
                        _self.CONTEXT_IMAGE_LINK,
                        _self.CONTEXT_IMAGE,
                        _self.CONTEXT_INPUT,
                        _self.CONTEXT_TEXT],
        context;

    for (context in everyContext) {
        if (_customContextItems[everyContext[context]]) { 
            delete _customContextItems[everyContext[context]][actionId];
        } 
    }
}

function addCustomItemsForContext(items, context) {
    var customItem; 
       
    if (_customContextItems[context]) {
        for (customItem in _customContextItems[context]) {
            items.push(_customContextItems[context][customItem]); 
        }
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

        for (i = 0; i < options.length; i++) {
            if (options[i].headText || options[i].subheadText) {
                header = document.getElementById('contextMenuHeader');
                header.className = 'contextMenuHeader';
                if (options[i].headText) {
                    contextmenu.setHeadText(options[i].headText);
                }
                if (options[i].subheadText) {
                    contextmenu.setSubheadText(options[i].subheadText);
                }
                continue;
            }
            menuItem = document.createElement('div');
            menuImage = document.createElement('img');
            menuImage.src = options[i].imageUrl ? options[i].imageUrl : document.getElementById('extension-url').innerText + 'images/generic_81_81_placeholder.png';
            menuImage.setAttribute("class", "menuImage");
            menuItem.appendChild(menuImage);
            menuItem.appendChild(document.createTextNode(options[i].label));
            menuItem.setAttribute("class", "menuItem");
            menuItem.onmousedown = handleMouseDown.bind(this, menuItem);
            menuItem.onmouseup = handleMouseUp.bind(this, options[i].actionId, menuItem);

            // Attach mouseleave handler using jQuery since native mouseleave event fires on sub elements as well
            jQuery(menuItem).mouseleave(handleMouseLeave.bind(this, menuItem));
            jQuery(menuItem).mouseenter(handleMouseEnter.bind(this, menuItem));

            menuItem.addEventListener('mousedown', contextmenu.handleMouseDown, false);
            menu.appendChild(menuItem);
        }
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


function defineReadOnlyField(field) {
    Object.defineProperty(_self, "CONTEXT_" + field, {"value": field, "writable": false});
}

_self = {
    addItem: function (context, action, callback) {
        addItem(context, action, callback);
    },

    removeItem: function (contexts, actionId) {
        removeItem(contexts, actionId);
    }
};

_self.__defineGetter__("enabled", function () {
    return _enabled;
});

_self.__defineSetter__("enabled", function (value) {
    _enabled = !!value;
});

defineReadOnlyField("ALL");
defineReadOnlyField("LINK");
defineReadOnlyField("IMAGE_LINK");
defineReadOnlyField("IMAGE");
defineReadOnlyField("INPUT");
defineReadOnlyField("TEXT");

module.exports = _self;
