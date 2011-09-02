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
var transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/io/dir/",
    FILE = "file://";

function _prunePrefix(path) {
    return path.replace(new RegExp("^" + FILE), '');
}

function _addPrefix(path) {
    return FILE + path;
}

module.exports = {
    createNewDir: function (path) {
        transport.call(_uri + "createNewDir", {
            post: {path: _prunePrefix(path)}
        });
    },
    deleteDirectory: function (path, recursive) {
        transport.call(_uri + "deleteDirectory", {
            post: {path: _prunePrefix(path), recursive: recursive}
        });
    },
    exists: function (path) {
        return transport.call(_uri + "exists", {
            post: {path: _prunePrefix(path)}
        });
    },
    getFreeSpaceForRoot: function (path) {
        return transport.call(_uri + "getFreeSpaceForRoot", {
            post: {path: _prunePrefix(path)}
        });
    },
    getParentDirectory: function (path) {
        return _addPrefix(transport.call(_uri + "getParentDirectory", {
            post: {path: _prunePrefix(path)}
        }));
    },
    getRootDirs: function () {
        return transport.call(_uri + "getRootDirs", {}).map(function (dir) {
            return FILE + dir;
        });
    },
    listDirectories: function (path) {
        return transport.call(_uri + "listDirectories", {
            post: {path: _prunePrefix(path)}
        });
    },
    listFiles: function (path) {
        return transport.call(_uri + "listFiles", {
            post: {path: _prunePrefix(path)}
        });
    },
    rename: function (path, newName) {
        transport.call(_uri + "rename", {
            post: {path: _prunePrefix(path), newName: newName}
        });
    }
};
