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
    select = require('ripple/platform/webworks.core/2.0.0/select'),
    _self;

function _get() {
    return db.retrieveObject("webworks-pim-memo-list") || {};
}

function _do(func) {
    var memos = _get();
    func(memos);
    db.saveObject("webworks-pim-memo-list", memos);
}

_self = {
    find: function (get, post) {
        var memos = select.from(_get())
                    .orderBy(post.orderBy, post.isAscending === false ? "desc" : "asc")
                    .max(post.maxReturn)
                    .where(post.filter);
        return {code: 1, data: memos};
    },
    remove: function (get, post) {
        _do(function (memos) {
            if (!memos[get.uid]) {
                throw "attempting to delete a non existant memo with uid: " + get.uid;
            }
            delete memos[get.uid];
        });
        return {code: 1};
    },
    save: function (get, post) {
        _do(function (memos) {
            memos[post.memo.uid] = post.memo;
        });
        return {code: 1};
    }
};

module.exports = _self;
