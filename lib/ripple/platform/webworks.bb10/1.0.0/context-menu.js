
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
    contextMenuUI = require('ripple/ui/plugins/context-menu'),
    _currentContext,
    _enabled = true,
    _actions = require('./context-menu-actions'),
    _customContextItems = {},
    defaultContextMenuItems = {
        "IMAGE_LINK": ['Open', 'CopyLink', 'CopyImageLink', 'Cancel'],
        "IMAGE": ['CopyImageLink', 'SaveImage'],
        "LINK": ['Copy', 'CopyLink', 'Cancel'],
        "INPUT": ['Cut', 'Copy', 'ClearField', 'Cancel'],
        "TEXT": ['Copy', 'Cancel'],
        "ALL": ['Cancel']
    },
    CONTEXT_ALL = 'ALL',
    CONTEXT_LINK = 'LINK',
    CONTEXT_IMAGE_LINK = 'IMAGE_LINK',
    CONTEXT_IMAGE = 'IMAGE',
    CONTEXT_TEXT = 'TEXT',
    CONTEXT_INPUT = 'INPUT';

function generateMenuItems(menuItems) {
    var items = [],
        extensionUrl = document.getElementById('extension-url').innerText,
        imagePath = 'images/webworks/bb10/',
        hasCancel = false,
        i;

    for (i = 0; i < menuItems.length; i++) {
        switch (menuItems[i]) {
        case 'ClearField':
            items.push({'label': 'Clear Field', 'actionId': 'ClearField', 'imageUrl': extensionUrl + imagePath + 'Browser_Cancel_Selection.png'});
            break;
        case 'SendLink':
            break;
        case 'SendImageLink':
            break;
        case 'FullMenu':
            break;
        case 'Delete':
            break;
        case 'Cancel':
            items.push({'label': 'Dismiss Selection', 'actionId': 'Cancel', 'imageUrl': extensionUrl + imagePath + 'Browser_Cancel_Selection.png', 'isDelete': true});
            hasCancel = true;
            break;
        case 'Cut':
            items.push({'label': 'Cut', 'actionId': 'Cut', 'imageUrl': extensionUrl + imagePath + 'Browser_Cut.png'});
            break;
        case 'Copy':
            items.push({'label': 'Copy', 'actionId': 'Copy', 'imageUrl': extensionUrl + imagePath + 'Browser_Copy.png'});
            break;
        case 'Paste':
            items.push({'label': 'Paste', 'actionId': 'Paste', 'imageUrl': extensionUrl + imagePath + 'crosscutmenu_paste.png'});
            break;
        case 'Select':
            items.push({'label': 'Select', 'actionId': 'Select', 'imageUrl': extensionUrl + imagePath + 'crosscutmenu_paste.png'});
            break;
        case 'AddLinkToBookmarks':
            break;
        case 'CopyLink':
            items.push({'label': 'Copy Link', 'actionId': 'CopyLink', 'imageUrl': extensionUrl + imagePath + 'Browser_CopyLink.png'});
            break;
        case 'OpenLinkInNewTab':
            break;
        case 'OpenLink':
            items.push({'label': 'Open', 'actionId': 'OpenLink', 'imageUrl': extensionUrl + imagePath + 'Browser_OpenLink.png'});
            break;
        case 'SaveLinkAs':
            items.push({'label': 'Save Link as', 'actionId': 'SaveLinkAs', 'imageUrl': extensionUrl + imagePath + 'Browser_SaveLink.png'});
            break;
        case 'SaveImage':
            items.push({'label': 'Save Image', 'actionId': 'SaveImage', 'imageUrl': extensionUrl + imagePath + 'Browser_SaveImage.png'});
            break;
        case 'CopyImageLink':
            items.push({'label': 'Copy Image Link', 'actionId': 'CopyImageLink', 'imageUrl': extensionUrl + imagePath + 'Browser_CopyImageLink.png'});
            break;
        case 'ViewImage':
            break;
        case 'Search':
            break;
        case 'ShareLink':
            // local and file protocol won't have sharelink menuitem
            if (!/^local|^file/.test(_currentContext.url)) {
                items.push({'label': 'Share Link', 'actionId': 'ShareLink', 'imageUrl': extensionUrl + imagePath + 'Browser_ShareLink.png'});
            }
            break;
        case 'ShareImage':
            break;
        case 'InspectElement':
            items.push({'label': 'Inspect Element', 'actionId': 'InspectElement', 'imageUrl': extensionUrl + imagePath + 'generic_81_81_placeholder.png'});
            break;
        }
    }

    if (!hasCancel) {
        items.push({'label': 'Cancel', 'actionId': 'Cancel', 'imageUrl': extensionUrl + imagePath + 'Browser_Cancel_Selection.png', 'isDelete': true});
    }

    if (_currentContext && _currentContext.url && _currentContext.text) {
        items.push({'headText': _currentContext.text, 'subheadText': _currentContext.url});
    }

    return items;
}

function safeEval(jsonString) {
    return JSON.parse('{"obj":' + jsonString + '}').obj;
}

function addItem(success, fail, args) {
    var contexts = JSON.parse(decodeURIComponent(args["contexts"])),
        action = JSON.parse(decodeURIComponent(args["action"])),
        context;

    // Check actionId is valid or if item already has been added
    if (!action.actionId || action.actionId === '') {
        return fail('Cannot add item.  actionId is not valid');
    } else if (!_actions.addCustomItem(action.actionId)) {
        return fail('Cannot add item.  A menu item with the actionId "' + action.actionId + '" already exists.');
    }

    for (context in contexts) {
        if (!_customContextItems[contexts[context]]) {
            _customContextItems[contexts[context]] = {};
        }
        _customContextItems[contexts[context]][action.actionId] = action;
    }

    success();
}

function removeItemFromAllContexts(actionId) {
    var everyContext = [CONTEXT_ALL,
                        CONTEXT_LINK,
                        CONTEXT_IMAGE_LINK,
                        CONTEXT_IMAGE,
                        CONTEXT_INPUT,
                        CONTEXT_TEXT],
        context;

    for (context in everyContext) {
        if (_customContextItems[everyContext[context]]) {
            delete _customContextItems[everyContext[context]][actionId];
        }
    }
}

function removeItem(success, fail, args) {
    var contexts = JSON.parse(decodeURIComponent(args["contexts"])),
        actionId = safeEval(decodeURIComponent(args["actionId"])),
        context;

    for (context in contexts) {
        if (contexts[context] === CONTEXT_ALL) {
            removeItemFromAllContexts(actionId);
        } else {
            if (_customContextItems[contexts[context]]) {
                delete _customContextItems[contexts[context]][actionId];
            }
        }
    }
    _actions.removeCustomItem(actionId);
    success();
}

function addCustomItemsForContext(items, context) {
    var customItem,
        lastItem = items.slice(-1)[0],
        lastItemIsDelete = lastItem && lastItem.isDelete;

    if (_customContextItems[context.name]) {
        for (customItem in _customContextItems[context.name]) {
            if (lastItemIsDelete) {
                items.splice(-1, 0, _customContextItems[context.name][customItem]);
            }
            else {
                items.push(_customContextItems[context.name][customItem]);
            }
        }
    }
}

function addCustomItems(menuItems, currentContext) {
    addCustomItemsForContext(menuItems, CONTEXT_ALL);
    addCustomItemsForContext(menuItems, currentContext);
}

function showMenu() {
    var menuItems =  generateMenuItems(defaultContextMenuItems[_currentContext.name]);
    if (_enabled) {
        addCustomItems(menuItems, _currentContext);

        //ShowMenu
        ui.showOverlay("contextMenuWindow", function () {
            contextMenuUI.init();
            contextMenuUI.setMenuOptions(menuItems);
            contextMenuUI.peekContextMenu(true);
        }, true);
    }
}

event.on("ContextMenuEvent", function (context) {
    _currentContext = context;
    _actions.setCurrentContext(context);

    showMenu();
});

event.on("LayoutChanged", function () {
    showMenu();
});


_self = {
    addItem: function (contexts, action, callback) {
        if (typeof(callback) !== 'function') {
            callback = function () {};
        }
        addItem(callback, function (message) {
            throw message;
        }, {
            contexts: JSON.stringify(contexts),
            action: JSON.stringify(action)
        });
    },

    removeItem: function (contexts, actionId) {
        removeItem(function () {}, function () {}, {
            contexts: JSON.stringify(contexts),
            actionId: JSON.stringify(actionId)
        });
    },
};

Object.defineProperty(_self, 'enabled', {
    get: function () {
        return _enabled;
    },
    set: function (val) {
        _enabled = val;
    }
});

utils.defineReadOnlyField(_self, "CONTEXT_ALL", "ALL");
utils.defineReadOnlyField(_self, "CONTEXT_LINK", "LINK");
utils.defineReadOnlyField(_self, "CONTEXT_IMAGE_LINK", "IMAGE_LINK");
utils.defineReadOnlyField(_self, "CONTEXT_IMAGE", "IMAGE");
utils.defineReadOnlyField(_self, "CONTEXT_INPUT", "INPUT");
utils.defineReadOnlyField(_self, "CONTEXT_TEXT", "TEXT");

module.exports = _self;
