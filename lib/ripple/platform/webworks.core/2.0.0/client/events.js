/*
 * Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _handlers = [],
    _self;

_self = {
    eventsMap: {
        getHandlerById: function (handlerId) {
            return _handlers[handlerId];
        },
        addHandler: function (handler) {
            _handlers.push(handler);
            return _handlers.length - 1;
        },
        removeHandler: function (handlerId) {
            if (handlerId > -1 && handlerId < _handlers.length) {
                delete _handlers[handlerId]; //cannot splice because all published IDs would refer to the wrong handler
            }
        }
    },

    registerEventHandler : function (eventName, eventCallback) {
        return _self.eventsMap.addHandler(eventCallback);
    },

    getEventHandler : function (handlerId) {
        return _self.eventsMap.getHandlerById(handlerId);
    }
};

module.exports = _self;
