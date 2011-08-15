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
var select = require('ripple/platform/webworks.core/2.0.0/select'),
    db = require('ripple/db'),
    utils = require('ripple/utils'),
    _KEY = "blackberry-pim-task",
    _self;

function _get() {
    return db.retrieveObject(_KEY) || {};
}

function _save(tasks) {
    db.saveObject(_KEY, tasks);
}

_self = {
    save: function (get, post) {
        var tasks = _get(),
            properties = post.task,
            id = properties.uid;

        if (tasks[id]) {
            utils.mixin(properties, tasks[id]);
        } else {
            tasks[id] = properties;
        }

        _save(tasks);

        return {code: 1};
    },

    remove: function (get, post) {
        var tasks = _get(),
            id = get.id;

        delete tasks[id];

        _save(tasks);

        return {code: 1};
    },

    find: function (get, post) {
        var tasks = _get(),
            match = select.from(tasks);

        if (post.orderBy) {
            match.orderBy(post.orderBy, post.isAscending === false ? "desc" : "asc");
        }

        if (post.maxReturn) {
            match.max(post.maxReturn);
        }

        return {code: 1, data: match.where(post.filter)};
    }
};

module.exports = _self;
