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
var cache = require('ripple/platform/webworks.core/2.0.0/fsCache'),
    notifications = require('ripple/notifications');

function _packet(data) {
    return {
        code: 1,
        data: data
    };
}

module.exports = {
    copy: function (get, post) {
        cache.file.copy(post.from, post.to);
        return _packet();
    },
    deleteFile: function (get, post) {
        cache.file.deleteFile(post.path);
        return _packet();
    },
    exists: function (get, post) {
        return _packet(cache.file.exists(post.path));
    },
    getFileProperties: function (get, post) {
        return _packet(cache.file.getFileProperties(post.path));
    },
    open: function (get, post) {
        var msg = "Attempting to open file: " + post.path;
        notifications.openNotification("normal", msg);
        return _packet(cache.file.exists(post.path));
    },
    readFile: function (get, post, baton) {
        var val;

        if (post.async) {
            baton.take();
        }

        cache.file.readFile(post.path, function (data) {
            if (post.async) {
                baton.pass(_packet({
                    fullPath: post.path,
                    blobData: data
                }));
            } else {
                val = data;
            }
        }, post.async);

        if (!post.async) {
            return _packet({
                fullPath: post.path,
                blobData: val
            });
        }
    },
    rename: function (get, post) {
        cache.file.rename(post.path, post.newName);
        return _packet();
    },
    saveFile: function (get, post) {
        cache.file.saveFile(post.path, post.blob);
        return _packet();
    }
};
