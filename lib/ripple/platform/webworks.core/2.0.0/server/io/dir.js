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
var cache = require('ripple/platform/webworks.core/2.0.0/fileSystemCache');

//fileSystemCache.initialize();

function _packet(data) {
    return {
        code: 1,
        data: data
    };
}

module.exports = {
    createNewDir: function (get, post, baton) {
        cache.dir.createNewDir(post.path);
        return _packet();
    },
    deleteDirectory: function (get, post, baton) {
        cache.dir.deleteDirectory(post.path, post.recursive);
        return _packet();
    },
    exists: function (get, post, baton) {
        cache.dir.exists(post.path);
        return _packet();
    },
    getFreeSpaceForRoot: function (get, post, baton) {
        //TODO: what to do here?
        return _packet();
    },
    getParentDirectory: function (get, post, baton) {
        cache.dir.getParentDirectory(post.path);
        return _packet();
    },
    getRootDirs: function (get, post, baton) {
        cache.dir.getRootDirs();
        return _packet();
    },
    listDirectories: function (get, post, baton) {
        cache.dir.listDirectories(post.path);
        return _packet();
    },
    listFiles: function (get, post, baton) {
        cache.dir.listFiles(post.path);
        return _packet();
    },
    rename: function (get, post, baton) {
        cache.dir.rename(post.path, post.newName);
        return _packet();
    },
};
