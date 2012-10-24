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
var cache = require('ripple/client/platform/webworks.core/2.0.0/fsCache');

function _packet(data) {
    return {
        code: 1,
        data: data
    };
}

module.exports = {
    createNewDir: function (get, post) {
        cache.dir.createNewDir(post.path);
        return _packet();
    },
    deleteDirectory: function (get, post) {
        cache.dir.deleteDirectory(post.path, post.recursive);
        return _packet();
    },
    exists: function (get, post) {
        return _packet(cache.dir.exists(post.path));
    },
    getParentDirectory: function (get, post) {
        return _packet(cache.dir.getParentDirectory(post.path));
    },
    listDirectories: function (get, post) {
        return _packet(cache.dir.listDirectories(post.path));
    },
    listFiles: function (get, post) {
        return _packet(cache.dir.listFiles(post.path));
    },
    rename: function (get, post) {
        cache.dir.rename(post.path, post.newName);
        return _packet();
    }
};
