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
var transport = ripple('platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/pim/memo/";

function Memo() {
    var _self = {
        categories: [],
        note: null,
        title: null,
        uid: null,
        remove: function () {
            transport.call(_uri + "remove", {
                get: {uid: _self.uid}
            });
        },
        save: function () {
            if (_self.uid  === null) {
                _self.uid  = Number(Math.uuid(8, 10));
            }
            transport.call(_uri + "save", {
                post: {memo: _self}
            });
        }
    };

    return _self;
}

Memo.find = function (filter, orderBy, maxReturn, service, isAscending) {
    var opts = {
        post: {
            filter: filter,
            orderBy: orderBy,
            maxReturn: maxReturn,
            isAscending: isAscending,
            service: service
        }
    };

    return transport.call(_uri + "find", opts).map(function (obj) {
        var memo = new Memo();
        memo.uid = obj.uid;
        memo.categories = obj.categories || [];
        memo.note = obj.note;
        memo.title = obj.title;
        return memo;
    });
};

module.exports = Memo;
