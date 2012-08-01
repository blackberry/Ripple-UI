/*
 * Copyright 2012 Research In Motion Limited.
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

var _event = require('ripple/event'),
    _menuItems,
    _currentContext,
    _handlers = {},
    _customHandlers = {},
    menuActions;

function setCurrentContext(context) {
    _currentContext = context;
}

// Default context menu response handler
function handleContextMenuResponse(args) {
    // Handle menu response
}

function loadClientURL(args) {
    // Load url
}

function openLink() {
    if (!_currentContext || !_currentContext.url) {
        return;
    }

    // Update the content web view with the new URL
}

function responseHandler(menuAction) {
    if (!menuAction) {
        return;
    }
    handleContextMenuResponse([menuAction]);
}

function customItemHandler(actionId) {
    _event.trigger('contextmenu.executeMenuAction', [actionId]);    
}

function addCustomItem(actionId) {
    if (_customHandlers[actionId]) {
        return false;
    } else {
        _customHandlers[actionId] = customItemHandler.bind(this, actionId);
        return true;
    }
}

function removeCustomItem(actionId) {
    if (_customHandlers[actionId]) {
        delete _customHandlers[actionId];
    }
}

function clearCustomHandlers() {
    _customHandlers = {};
}

function runHandler(actionId) {
    if (_customHandlers[actionId]) {
        _customHandlers[actionId](actionId);
    } else if (_handlers[actionId]) {
        _handlers[actionId](actionId);
    }
}

_handlers = {
    'SaveLink'       : null,
    'Cancel'         : responseHandler,
    'ClearField'     : responseHandler,
    'Cut'            : responseHandler,
    'Copy'           : responseHandler,
    'Paste'          : responseHandler,
    'Select'         : responseHandler,
    'CopyLink'       : responseHandler,
    'OpenLink'       : openLink,
    'SaveLinkAs'     : null,
    'CopyImageLink'  : responseHandler,
    'SaveImage'      : null,
    'ShareLink'      : null,
    'InspectElement' : responseHandler
};

menuActions = {
    handlers: _handlers,
    runHandler: runHandler,
    clearCustomHandlers: clearCustomHandlers,
    setCurrentContext: setCurrentContext,
    addCustomItem: addCustomItem,
    removeCustomItem: removeCustomItem
};

module.exports = menuActions;
