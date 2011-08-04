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
var db = require('ripple/db'),
    utils = require('ripple/utils'),
    select = require('ripple/platform/webworks.core/2.0.0/select'),
    Message = require('ripple/platform/webworks/2.0.0/client/Message'),
    _self;

function _get() {
    return db.retrieveObject("webworks-message-list") || {};
}

function _do(func) {
    var messages = _get();
    func(messages);
    db.saveObject("webworks-message-list", messages);
}

_self = {
    find: function (get, post) {
        var data = select
                .from(_get())
                .max(post.maxReturn)
                .where(post.filter);
        return {code: 1, data: data};
    },

    remove: function (get, post) {
        _do(function (messages) {
            if (!messages[get.uid]) {
                throw "attempting to delete a non existant message with uid: " + get.uid;
            }
            delete messages[get.uid];
        });
        return {code: 1};
    },

    save: function (get, post) {
        _do(function (messages) {
            var orig = messages[post.message.uid],
                updated = utils.copy(post.message);

            updated.folder = orig ? orig.folder : Message.FOLDER_DRAFT;
            updated.status = orig ? orig.status : Message.STATUS_DRAFT;

            messages[post.message.uid] = updated;
        });
        return {code: 1};
    },

    send: function (get, post) {
        _do(function (messages) {
            var updated = utils.copy(get.message);

            updated.folder = Message.FOLDER_SENT;
            updated.status = Message.STATUS_SENT;

            messages[updated.uid] = updated;
        });
        return {code: 1};
    }
};

module.exports = _self;
