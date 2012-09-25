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

var event = require('ripple/event'),
    _handlers = {},
    _customHandlers = {},
    _currentContext,
    menuActions;

function customItemHandler(actionId) {
    event.trigger('contextmenu.executeMenuAction', [actionId]);
}

function setCurrentContext(context) {
    _currentContext = context;
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
    }
}

menuActions = {
    handlers: _handlers,
    runHandler: runHandler,
    clearCustomHandlers: clearCustomHandlers,
    setCurrentContext: setCurrentContext,
    addCustomItem: addCustomItem,
    removeCustomItem: removeCustomItem
};

module.exports = menuActions;
