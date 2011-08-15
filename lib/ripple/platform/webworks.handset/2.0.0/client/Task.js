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
    _uri = "blackberry/pim/Task/";

function Task() {
    var _self = {
        save: function () {
            if (!_self.uid) {
                _self.uid = Math.uuid(null, 16);
            }
            transport.call(_uri + "save",  {
                post: {
                    task: _self
                }
            });
        },
        remove: function () {
            if (!_self.uid) {
                throw "task has not yet been saved (has no uid)";
            }
            transport.call(_uri + "remove", {
                get: {
                    id: _self.uid
                }
            });
        },
        uid: null,
        categories: [],
        due: null,
        note: "",
        priority: Task.PRIORITY_NORMAL,
        recurrence: null,
        reminder: null,
        status: Task.NOT_STARTED,
        summary: ""
    };

    return _self;
}

function _massage(property, name) {
    if (name === "recurrence" && property) {
        if (property.end) {
            property.end = new Date(property.end);
        }
    }
    if (name === "reminder" && property) {
        if (property.date) {
            property.date = new Date(property.date);
        }
    }
    if (name === "due" && property) {
        property = new Date(property);
    }
    return property;
}

Task.find = function (filter, orderBy, maxReturn, isAscending) {
    return transport.call(_uri + "find", {
        post: {
            filter: filter,
            orderBy: orderBy,
            maxReturn: maxReturn,
            isAscending: isAscending
        }
    }).map(function (properties) {
        var task = new Task(),
            key;
        for (key in properties) {
            if (task.hasOwnProperty(key)) {
                task[key] = _massage(properties[key], key);
            }
        }
        return task;
    });
};

Task.__defineGetter__("NOT_STARTED", function () {
    return 0;
});

Task.__defineGetter__("IN_PROGRESS", function () {
    return 1;
});

Task.__defineGetter__("COMPLETED", function () {
    return 2;
});

Task.__defineGetter__("WAITING", function () {
    return 3;
});

Task.__defineGetter__("DEFERRED", function () {
    return 4;
});

Task.__defineGetter__("PRIORITY_HIGH", function () {
    return 0;
});

Task.__defineGetter__("PRIORITY_NORMAL", function () {
    return 1;
});

Task.__defineGetter__("PRIORITY_LOW", function () {
    return 2;
});

module.exports = Task;
